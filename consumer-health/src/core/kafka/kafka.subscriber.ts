import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import type { LibrdKafkaError } from '@confluentinc/kafka-javascript';
import { kafkaConfig } from '@config/kafka.config';
import type {
  ConsumedMessage,
  MessageHandler,
} from '@interfaces/kafka.interface';
import { fromTimestamp } from '@utils/date.util';
import { readHeader } from '@utils/header.util';
import { toLogFields } from '@utils/log.util';
import { KafkaAdmin } from './kafka.admin';
import { CLIENT_ID, REBALANCE_CODES } from './kafka.constants';
import { KAFKA_SCHEMA } from './kafka.schema';

@Injectable()
export class KafkaSubscriber implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(KafkaSubscriber.name);
  private readonly handlers = new Map<string, MessageHandler>();

  private consumer: KafkaJS.Consumer;

  constructor(private readonly configService: ConfigService) {}

  subscribe<Payload>(messageType: string, handler: MessageHandler<Payload>): void {
    this.handlers.set(messageType, handler as MessageHandler);
  }

  async onApplicationBootstrap(): Promise<void> {
    const { brokers, groupId } = kafkaConfig(this.configService);
    const kafka = new KafkaJS.Kafka({
      kafkaJS: { clientId: CLIENT_ID, brokers, logLevel: KafkaJS.logLevel.WARN },
    });
    const topics = Object.values(KAFKA_SCHEMA.topics);

    await new KafkaAdmin(kafka.admin()).createTopics(topics, { waitForLeaders: true });

    this.consumer = kafka.consumer({
      kafkaJS: {
        groupId,
        fromBeginning: true,
        autoCommit: true,
      },
      rebalance_cb: (event: LibrdKafkaError, assignment: KafkaJS.TopicPartition[]) =>
        this.logRebalance(event, assignment),
    });

    await this.consumer.connect();
    await this.consumer.subscribe({ topics: topics.map((topic) => topic.name) });
    await this.consumer.run({ eachMessage: (payload) => this.dispatch(payload) });

    const topicNames = topics.map((topic) => topic.name).join(',');
    this.logger.log(`Consuming ${toLogFields({ topics: topicNames, group: groupId })}`);
  }

  private async dispatch({
    topic,
    partition,
    message,
  }: KafkaJS.EachMessagePayload): Promise<void> {
    const type = readHeader(message.headers, 'type');
    const key = message.key?.toString();

    this.logger.log(
      `Received ${toLogFields({ type, topic, partition, offset: message.offset, key })}`,
    );

    const handler = type ? this.handlers.get(type) : undefined;

    if (!type || !handler) {
      this.logger.warn(
        `Skipped, no handler ${toLogFields({ type, topic, partition, offset: message.offset })}`,
      );
      return;
    }

    try {
      const consumedMessage: ConsumedMessage = {
        id: readHeader(message.headers, 'message-id'),
        type,
        topic,
        partition,
        offset: message.offset,
        key,
        occurredAt: fromTimestamp(message.timestamp),
        payload: JSON.parse(message.value?.toString() ?? 'null'),
      };

      await handler(consumedMessage);
    } catch (error) {
      this.logger.error(
        `Skipped, handler failed ${toLogFields({
          type,
          topic,
          partition,
          offset: message.offset,
          error: (error as Error).message,
        })}`,
      );
    }
  }

  private logRebalance(
    event: LibrdKafkaError,
    assignment: KafkaJS.TopicPartition[],
  ): void {
    const partitions = assignment
      .map(({ topic, partition }) => `${topic}-${partition}`)
      .join(',');

    if (event.code === REBALANCE_CODES.ASSIGN_PARTITIONS) {
      this.logger.log(`Partitions assigned ${toLogFields({ partitions })}`);
    } else if (event.code === REBALANCE_CODES.REVOKE_PARTITIONS) {
      this.logger.log(`Partitions revoked ${toLogFields({ partitions })}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer?.disconnect();
  }
}
