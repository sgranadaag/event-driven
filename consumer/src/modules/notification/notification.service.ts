import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/rabbit.interface';
import type { Notification } from './interfaces/notification.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  send({ queue, payload: notification }: ConsumedMessage<Notification>): void {
    this.logger.log(
      `Sending "${notification.event}" ${notification.channel} notification ` +
        `${notification.id} from "${queue}": ${notification.message}`,
    );
  }
}
