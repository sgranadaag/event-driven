import type { KafkaSchema } from '@interfaces/kafka.interface';

export const KAFKA_SCHEMA = {
  topics: {
    queries: {
      name: 'db-queries',
      partitions: 3,
      config: { 'retention.ms': '86400000' },
    },
  },
} satisfies KafkaSchema;
