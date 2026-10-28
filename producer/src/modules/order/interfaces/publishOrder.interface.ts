import type {
  Order,
  OrderPriority,
  OrderPriorityLevel,
} from './order.interface';

export interface OrderInput {
  product: string;
  quantity: number;
}

export interface PrioritizeOrderInput {
  priority: OrderPriorityLevel;
  region: string;
}

export interface PublishOrderResult {
  order: Order;
  messageId: string;
  routed: boolean;
}

export interface PublishOrderPriorityResult {
  orderPriority: OrderPriority;
  messageId: string;
  routed: boolean;
}
