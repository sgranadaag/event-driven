export interface RabbitConfig {
  url: string;
  notificationChannel: string;
}

export interface ExchangeDefinition {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
}

export interface BindingDefinition {
  exchange: string;
  routingKey?: string;
  arguments?: Record<string, string>;
}

export interface QueueDefinition {
  name: string;
  bindings: BindingDefinition[];
}

export interface RabbitSchema {
  exchanges: Record<string, ExchangeDefinition>;
  queues: Record<string, QueueDefinition>;
}

export interface ConsumedMessage<Payload = unknown> {
  id: string;
  type: string;
  exchange: string;
  queue: string;
  routingKey: string;
  headers: Record<string, unknown>;
  occurredAt: Date;
  redelivered: boolean;
  payload: Payload;
}

export type MessageHandler<Payload = unknown> = (
  message: ConsumedMessage<Payload>,
) => void | Promise<void>;
