import type { RabbitSchema } from '@interfaces/rabbit.interface';

export const RABBIT_SCHEMA = {
  exchanges: {
    orders: { name: 'orders.direct', type: 'direct' },
    notifications: { name: 'notifications.topic', type: 'topic' },
    broadcast: { name: 'broadcast.fanout', type: 'fanout' },
    orderAttributes: { name: 'orders.headers', type: 'headers' },
  },
  queues: [
    {
      name: 'orders.create',
      bindings: [
        { exchange: 'orders.direct', routingKey: 'order.create' },
        { exchange: 'broadcast.fanout', routingKey: '' },
      ],
    },
    {
      name: 'notifications.email',
      bindings: [
        { exchange: 'notifications.topic', routingKey: 'notification.email.*' },
        { exchange: 'broadcast.fanout', routingKey: '' },
      ],
    },
    {
      name: 'notifications.sms',
      bindings: [
        { exchange: 'notifications.topic', routingKey: 'notification.sms.*' },
        { exchange: 'notifications.topic', routingKey: '#.urgent' },
        { exchange: 'broadcast.fanout', routingKey: '' },
      ],
    },
    {
      name: 'orders.match-all',
      bindings: [
        {
          exchange: 'orders.headers',
          routingKey: '',
          arguments: { 'x-match': 'all', priority: 'high', region: 'co' },
        },
        { exchange: 'broadcast.fanout', routingKey: '' },
      ],
    },
    {
      name: 'orders.match-any',
      bindings: [
        {
          exchange: 'orders.headers',
          routingKey: '',
          arguments: { 'x-match': 'any', priority: 'high', region: 'co' },
        },
        { exchange: 'broadcast.fanout', routingKey: '' },
      ],
    },
  ],
} satisfies RabbitSchema;
