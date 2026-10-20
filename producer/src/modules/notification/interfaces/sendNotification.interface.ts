import type { Notification } from './notification.interface';

export interface SendNotificationInput {
  channel: string;
  event: string;
  message: string;
}

export interface SendNotificationResult {
  notification: Notification;
  routingKey: string;
  messageId: string;
  routed: boolean;
}
