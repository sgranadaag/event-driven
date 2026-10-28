import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';
import type { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import { rabbitConfig } from '@config/rabbit.config';
import type {
  ConsumedMessage,
  MessageHandler,
} from '@interfaces/rabbit.interface';
import { fromUnixSeconds } from '@utils/date.util';
import { EMPTY_ROUTING_KEY, PREFETCH_COUNT } from './rabbit.constants';
import { RABBIT_SCHEMA } from './rabbit.schema';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class RabbitSubscriber implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(RabbitSubscriber.name);
  private readonly handlers = new Map<string, MessageHandler>();

  private connection: ChannelModel;

  constructor(private readonly configService: ConfigService) {}

  subscribe<Payload>(messageType: string, handler: MessageHandler<Payload>): void {
    this.handlers.set(messageType, handler as MessageHandler);
  }

  async onApplicationBootstrap(): Promise<void> {
    const { url, notificationChannel } = rabbitConfig(this.configService);
    const queue = RABBIT_SCHEMA.queues[notificationChannel];

    if (!queue) {
      const supportedChannels = Object.keys(RABBIT_SCHEMA.queues).join(', ');
      throw new Error(
        `Unknown notification channel "${notificationChannel}": use one of ${supportedChannels}`,
      );
    }

    this.connection = await connect(url);
    const channel = await this.connection.createChannel();

    for (const exchange of Object.values(RABBIT_SCHEMA.exchanges)) {
      await channel.assertExchange(exchange.name, exchange.type, { durable: true });
    }

    await channel.assertQueue(queue.name, { durable: true });

    for (const binding of queue.bindings) {
      await channel.bindQueue(
        queue.name,
        binding.exchange,
        binding.routingKey ?? EMPTY_ROUTING_KEY,
        binding.arguments,
      );
    }

    await channel.prefetch(PREFETCH_COUNT);

    await channel.consume(queue.name, (message) =>
      void this.dispatch(channel, queue.name, message),
    );

    this.logger.log(`Consuming ${notificationChannel} notifications from "${queue.name}"`);
  }

  private async dispatch(
    channel: Channel,
    queue: string,
    message: ConsumeMessage | null,
  ): Promise<void> {
    if (!message) return;

    const { exchange, routingKey, redelivered } = message.fields;
    const { messageId, type } = message.properties;

    this.logger.log(
      `Received ${toLogFields({
        type,
        exchange,
        key: routingKey || undefined,
        queue,
        redelivered: redelivered || undefined,
      })}`,
    );

    const handler = this.handlers.get(type);

    if (!handler) {
      this.logger.warn(`Discarded, no handler ${toLogFields({ type, queue })}`);
      channel.nack(message, false, false);
      return;
    }

    try {
      const consumedMessage: ConsumedMessage = {
        id: messageId,
        type,
        exchange,
        queue,
        routingKey,
        headers: message.properties.headers ?? {},
        occurredAt: fromUnixSeconds(message.properties.timestamp),
        redelivered,
        payload: JSON.parse(message.content.toString()),
      };

      await handler(consumedMessage);

      channel.ack(message);
    } catch (error) {
      this.logger.error(
        `Discarded, handler failed ${toLogFields({
          type,
          queue,
          error: (error as Error).message,
        })}`,
      );
      channel.nack(message, false, false);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }
}
