import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';
import type { ChannelModel, ConfirmChannel } from 'amqplib';
import { rabbitConfig } from '@config/rabbit.config';
import { generateId } from '@utils/crypto.util';
import { toUnixSeconds } from '@utils/date.util';
import { EXCHANGE_TYPE, JSON_CONTENT_TYPE } from './rabbit.constants';

@Injectable()
export class RabbitPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitPublisher.name);

  private connection: ChannelModel;
  private channel: ConfirmChannel;
  private exchange: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const { url, exchange } = rabbitConfig(this.configService);

    this.exchange = exchange;
    this.connection = await connect(url);
    this.channel = await this.connection.createConfirmChannel();

    await this.channel.assertExchange(exchange, EXCHANGE_TYPE, { durable: true });

    this.logger.log(`Publishing to exchange "${exchange}"`);
  }

  async publish(eventType: string, payload: object): Promise<string> {
    const eventId = generateId();
    const occurredAtSeconds = toUnixSeconds(new Date());
    const content = Buffer.from(JSON.stringify(payload));

    this.channel.publish(this.exchange, eventType, content, {
      messageId: eventId,
      type: eventType,
      timestamp: occurredAtSeconds,
      contentType: JSON_CONTENT_TYPE,
      persistent: true,
    });
    await this.channel.waitForConfirms();

    this.logger.log(`Published ${eventType} (event ${eventId})`);

    return eventId;
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }
}
