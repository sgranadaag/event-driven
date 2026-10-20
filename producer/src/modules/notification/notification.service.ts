import { Injectable } from '@nestjs/common';
import { RabbitPublisher } from '@core/rabbit/rabbit.publisher';
import { RABBIT_SCHEMA } from '@core/rabbit/rabbit.schema';
import { generateId } from '@utils/crypto.util';
import {
  NOTIFICATION_MESSAGE,
  NOTIFICATION_ROUTING_KEY_PREFIX,
} from './notification.constants';
import type { Notification } from './interfaces/notification.interface';
import type {
  SendNotificationInput,
  SendNotificationResult,
} from './interfaces/sendNotification.interface';

@Injectable()
export class NotificationService {
  constructor(private readonly rabbitPublisher: RabbitPublisher) {}

  async send({
    channel,
    event,
    message,
  }: SendNotificationInput): Promise<SendNotificationResult> {
    const notification: Notification = { id: generateId(), channel, event, message };
    const routingKey = `${NOTIFICATION_ROUTING_KEY_PREFIX}.${channel}.${event}`;

    const { messageId, routed } = await this.rabbitPublisher.publish({
      exchange: RABBIT_SCHEMA.exchanges.notifications.name,
      routingKey,
      type: NOTIFICATION_MESSAGE,
      payload: notification,
    });

    return { notification, routingKey, messageId, routed };
  }
}
