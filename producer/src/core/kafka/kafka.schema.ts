import type { KafkaSchema } from '@interfaces/kafka.interface';

export const KAFKA_SCHEMA = {
  topics: {
    interactions: {
      name: 'interactions',
      partitions: 3,
      config: { 'retention.ms': '604800000' },
    },
    queries: {
      name: 'db-queries',
      partitions: 3,
      config: { 'retention.ms': '86400000' },
    },
    health: {
      name: 'service-health',
      partitions: 3,
      config: { 'retention.ms': '2592000000' },
    },
  },
} satisfies KafkaSchema;
