import type { KafkaSchema } from '@interfaces/kafka.interface';

export const KAFKA_SCHEMA = {
  topics: {
    health: {
      name: 'service-health',
      partitions: 3,
      config: { 'retention.ms': '2592000000' },
    },
  },
} satisfies KafkaSchema;
