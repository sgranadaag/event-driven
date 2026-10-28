import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/rabbit.interface';
import type { Notification } from './interfaces/notification.interface';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  send({ queue, payload: notification }: ConsumedMessage<Notification>): void {
    this.logger.log(
      `Notification sent ${toLogFields({
        channel: notification.channel,
        event: notification.event,
        queue,
        message: notification.message,
      })}`,
    );
  }
}
