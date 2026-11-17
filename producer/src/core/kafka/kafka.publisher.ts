import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { kafkaConfig } from '@config/kafka.config';
import type {
  PublishMessageInput,
  PublishMessageResult,
} from '@interfaces/kafka.interface';
import { generateId } from '@utils/crypto.util';
import { toLogFields } from '@utils/log.util';
import { KafkaAdmin } from './kafka.admin';
import { ACKS_ALL, CLIENT_ID } from './kafka.constants';
import { KAFKA_SCHEMA } from './kafka.schema';

@Injectable()
export class KafkaPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPublisher.name);

  private producer: KafkaJS.Producer;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const { brokers } = kafkaConfig(this.configService);
    const kafka = new KafkaJS.Kafka({
      kafkaJS: { clientId: CLIENT_ID, brokers, logLevel: KafkaJS.logLevel.WARN },
    });

    const topics = Object.values(KAFKA_SCHEMA.topics);
    await new KafkaAdmin(kafka.admin()).createTopics(topics, { waitForLeaders: true });

    const topicNames = topics.map((topic) => topic.name);
    this.logger.log(`Topics declared: ${topicNames.join(', ')}`);
    this.producer = kafka.producer({
      kafkaJS: { idempotent: true, acks: ACKS_ALL },
    });
    await this.producer.connect();
  }

  async publish({
    topic,
    type,
    key,
    payload,
    partition,
  }: PublishMessageInput): Promise<PublishMessageResult> {
    const messageId = generateId();
    const explicitPartition = partition === undefined ? {} : { partition };

    const [metadata] = await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(payload),
          headers: {
            'message-id': messageId,
            'type': type,
            'content-type': 'application/json',
          },
          ...explicitPartition,
        },
      ],
    });

    const offset = String(metadata.baseOffset);
    this.logger.log(
      `Published ${toLogFields({ type, topic, partition: metadata.partition, offset, key })}`,
    );

    return { messageId, partition: metadata.partition, offset };
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer?.disconnect();
  }
}
