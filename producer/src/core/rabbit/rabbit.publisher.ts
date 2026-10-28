import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';
import type { ChannelModel, ConfirmChannel, Options } from 'amqplib';
import { rabbitConfig } from '@config/rabbit.config';
import type {
  PublishMessageInput,
  PublishMessageResult,
} from '@interfaces/rabbit.interface';
import { generateId } from '@utils/crypto.util';
import { toUnixSeconds } from '@utils/date.util';
import { JSON_CONTENT_TYPE } from './rabbit.constants';
import { RABBIT_SCHEMA } from './rabbit.schema';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class RabbitPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitPublisher.name);
  private readonly returnedMessageIds = new Set<string>();

  private connection: ChannelModel;
  private channel: ConfirmChannel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const { url } = rabbitConfig(this.configService);

    this.connection = await connect(url);
    this.channel = await this.connection.createConfirmChannel();
    this.channel.on('return', (message) =>
      this.returnedMessageIds.add(message.properties.messageId),
    );

    for (const exchange of Object.values(RABBIT_SCHEMA.exchanges)) {
      await this.channel.assertExchange(exchange.name, exchange.type, {
        durable: true,
      });
    }

    const exchangeNames = Object.values(RABBIT_SCHEMA.exchanges).map(
      (exchange) => exchange.name,
    );
    this.logger.log(`Exchanges declared: ${exchangeNames.join(', ')}`);
  }

  async publish({
    exchange,
    routingKey,
    type,
    payload,
    headers,
  }: PublishMessageInput): Promise<PublishMessageResult> {
    const messageId = generateId();
    const content = Buffer.from(JSON.stringify(payload));
    const options: Options.Publish = {
      messageId,
      type,
      headers,
      timestamp: toUnixSeconds(new Date()),
      contentType: JSON_CONTENT_TYPE,
      persistent: true,
      mandatory: true,
    };

    await new Promise<void>((resolve, reject) => {
      this.channel.publish(exchange, routingKey, content, options, (error) =>
        error ? reject(error) : resolve(),
      );
    });

    const wasReturned = this.returnedMessageIds.delete(messageId);
    const fields = toLogFields({ type, exchange, key: routingKey || undefined });

    if (wasReturned) {
      this.logger.warn(`Not routed to any queue, lost ${fields}`);
    } else {
      this.logger.log(`Published ${fields}`);
    }

    return { messageId, routed: !wasReturned };
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }
}
