export const ORDER_CREATE_MESSAGE = 'order.create';

export const ORDER_UPDATE_MESSAGE = 'order.update';

export const ORDER_PRIORITIZE_MESSAGE = 'order.prioritize';

/** The special handling each priority queue stands for. */
export const PRIORITY_HANDLING_BY_QUEUE: Record<string, string> = {
  'orders.express': 'express',
  'orders.priority': 'priority',
};
