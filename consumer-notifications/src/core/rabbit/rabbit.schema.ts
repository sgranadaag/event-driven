import type { RabbitSchema } from '@interfaces/rabbit.interface';

export const RABBIT_SCHEMA: RabbitSchema = {
  exchanges: {
    notifications: { name: 'notifications.topic', type: 'topic' },
    broadcast: { name: 'broadcast.fanout', type: 'fanout' },
  },
  queues: {
    email: {
      name: 'notifications.email',
      bindings: [
        { exchange: 'notifications.topic', routingKey: 'notification.email.*' },
        { exchange: 'broadcast.fanout' },
      ],
    },
    sms: {
      name: 'notifications.sms',
      bindings: [
        { exchange: 'notifications.topic', routingKey: 'notification.sms.*' },
        { exchange: 'notifications.topic', routingKey: '#.urgent' },
        { exchange: 'broadcast.fanout' },
      ],
    },
  },
};
