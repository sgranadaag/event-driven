import type { ORDER_PRIORITIES } from '../order.constants';

export type OrderPriorityLevel = (typeof ORDER_PRIORITIES)[number];

export interface Order {
  id: string;
  product: string;
  quantity: number;
}

export interface OrderPriority {
  id: string;
  priority: OrderPriorityLevel;
  region: string;
}
