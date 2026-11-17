export const CLIENT_ID = 'consumer-interactions';

export const REPLICATION_FACTOR = 1;

export const NO_LEADER = -1;

export const TOPIC_READY_ATTEMPTS = 20;

export const TOPIC_READY_INTERVAL_MS = 500;

export const REBALANCE_CODES = {
  ASSIGN_PARTITIONS: -175,
  REVOKE_PARTITIONS: -174,
} as const;
