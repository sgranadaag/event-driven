export interface RabbitConfig {
  url: string;
}

export interface ExchangeDefinition {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
}

export interface RabbitSchema {
  exchanges: Record<string, ExchangeDefinition>;
}

export interface PublishMessageInput {
  exchange: string;
  routingKey: string;
  type: string;
  payload: object;

  headers?: Record<string, string>;
}

export interface PublishMessageResult {
  messageId: string;
  routed: boolean;
}
