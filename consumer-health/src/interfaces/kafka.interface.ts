export interface KafkaConfig {
  brokers: string[];
  groupId: string;
}

export interface TopicDefinition {
  name: string;
  partitions: number;
  config: Record<string, string>;
}

export interface KafkaSchema {
  topics: Record<string, TopicDefinition>;
}

export interface ConsumedMessage<Payload = unknown> {
  id: string | undefined;
  type: string;
  topic: string;
  partition: number;
  offset: string;
  key: string | undefined;
  occurredAt: Date;
  payload: Payload;
}

export type MessageHandler<Payload = unknown> = (
  message: ConsumedMessage<Payload>,
) => void | Promise<void>;
