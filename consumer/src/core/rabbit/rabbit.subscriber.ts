import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';
import type { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import type {
  ConsumedEvent,
  EventHandler,
} from '@interfaces/consumedEvent.interface';
import { rabbitConfig } from '@config/rabbit.config';
import { fromUnixSeconds } from '@utils/date.util';
import { EXCHANGE_TYPE, PREFETCH_COUNT } from './rabbit.constants';

@Injectable()
export class RabbitSubscriber implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(RabbitSubscriber.name);
  private readonly handlers = new Map<string, EventHandler>();

  private connection: ChannelModel;

  constructor(private readonly configService: ConfigService) {}

  subscribe<Payload>(eventType: string, handler: EventHandler<Payload>): void {
    this.handlers.set(eventType, handler as EventHandler);
  }

  async onApplicationBootstrap(): Promise<void> {
    const { url, exchange, queue } = rabbitConfig(this.configService);
    const eventTypes = [...this.handlers.keys()];

    this.connection = await connect(url);
    const channel = await this.connection.createChannel();

    await channel.assertExchange(exchange, EXCHANGE_TYPE, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    for (const eventType of eventTypes) {
      await channel.bindQueue(queue, exchange, eventType);
    }
    await channel.prefetch(PREFETCH_COUNT);

    await channel.consume(queue, (message) => void this.dispatch(channel, message));

    this.logger.log(
      `Consuming queue "${queue}" from exchange "${exchange}": ${eventTypes.join(', ')}`,
    );
  }

  private async dispatch(
    channel: Channel,
    message: ConsumeMessage | null,
  ): Promise<void> {
    if (!message) return;

    const handler = this.handlers.get(message.fields.routingKey);

    if (!handler) {
      this.logger.warn(`No handler for ${message.fields.routingKey}, discarded`);
      channel.nack(message, false, false);
      return;
    }

    try {
      const event: ConsumedEvent = {
        id: message.properties.messageId,
        type: message.fields.routingKey,
        occurredAt: fromUnixSeconds(message.properties.timestamp),
        redelivered: message.fields.redelivered,
        payload: JSON.parse(message.content.toString()),
      };

      await handler(event);

      channel.ack(message);
    } catch (error) {
      this.logger.error(
        `Event ${message.properties.messageId} failed, discarded: ${(error as Error).message}`,
      );
      channel.nack(message, false, false);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }
}
