export interface KafkaConfig {
  brokers: string[];
}

export interface TopicDefinition {
  name: string;
  partitions: number;
  config: Record<string, string>;
}

export interface KafkaSchema {
  topics: Record<string, TopicDefinition>;
}

export interface PublishMessageInput {
  topic: string;
  type: string;
  key: string;
  payload: object;

  partition?: number;
}

export interface PublishMessageResult {
  messageId: string;
  partition: number;
  offset: string;
}
