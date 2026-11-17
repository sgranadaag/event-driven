import { ConfigService } from '@nestjs/config';
import { ENV } from '@constants/environment.constant';
import type { KafkaConfig } from '@interfaces/kafka.interface';

const BROKER_LIST_SEPARATOR = ',';

export function kafkaConfig(configService: ConfigService): KafkaConfig {
  return {
    brokers: configService
      .getOrThrow<string>(ENV.KAFKA_BROKERS)
      .split(BROKER_LIST_SEPARATOR),
    groupId: configService.getOrThrow<string>(ENV.KAFKA_GROUP_ID),
  };
}
