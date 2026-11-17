import type { KafkaSchema } from '@interfaces/kafka.interface';

export const KAFKA_SCHEMA = {
  topics: {
    interactions: {
      name: 'interactions',
      partitions: 3,
      config: { 'retention.ms': '604800000' },
    },
  },
} satisfies KafkaSchema;
