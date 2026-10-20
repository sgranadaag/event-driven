import type { Order } from './order.interface';

export interface OrderInput {
  product: string;
  quantity: number;
}

export interface ClassifyOrderInput extends OrderInput {
  priority?: string;
  region?: string;
}

export interface PublishOrderResult {
  order: Order;
  messageId: string;
  routed: boolean;
}
