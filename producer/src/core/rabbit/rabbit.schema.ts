import type { RabbitSchema } from '@interfaces/rabbit.interface';

export const RABBIT_SCHEMA = {
  exchanges: {
    orders: { name: 'orders.direct', type: 'direct' },
    notifications: { name: 'notifications.topic', type: 'topic' },
    broadcast: { name: 'broadcast.fanout', type: 'fanout' },
    orderAttributes: { name: 'orders.headers', type: 'headers' },
  },
} satisfies RabbitSchema;
