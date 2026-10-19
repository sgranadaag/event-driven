import type { Order } from './order.interface';

export interface CreateOrderInput {
  product: string;
  quantity: number;
}

export interface CreateOrderResult {
  order: Order;

  eventId: string;
}
