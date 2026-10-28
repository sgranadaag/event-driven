import type { RabbitSchema } from '@interfaces/rabbit.interface';

export const RABBIT_SCHEMA = {
  exchanges: {
    orders: { name: 'orders.direct', type: 'direct' },
    broadcast: { name: 'broadcast.fanout', type: 'fanout' },
    orderAttributes: { name: 'orders.headers', type: 'headers' },
  },
  queues: [
    {
      name: 'orders.create',
      bindings: [
        { exchange: 'orders.direct', routingKey: 'order.create' },
        { exchange: 'broadcast.fanout' },
      ],
    },
    {
      name: 'orders.update',
      bindings: [
        { exchange: 'orders.direct', routingKey: 'order.update' },
        { exchange: 'broadcast.fanout' },
      ],
    },
    {
      name: 'orders.express',
      bindings: [
        {
          exchange: 'orders.headers',
          arguments: { 'x-match': 'all', priority: 'high', region: 'co' },
        },
        { exchange: 'broadcast.fanout' },
      ],
    },
    {
      name: 'orders.priority',
      bindings: [
        {
          exchange: 'orders.headers',
          arguments: { 'x-match': 'any', priority: 'high', region: 'co' },
        },
        { exchange: 'broadcast.fanout' },
      ],
    },
  ],
} satisfies RabbitSchema;
