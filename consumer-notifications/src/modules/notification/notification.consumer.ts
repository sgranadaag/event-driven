import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitSubscriber } from '@core/rabbit/rabbit.subscriber';
import { NOTIFICATION_MESSAGE } from './notification.constants';
import { NotificationService } from './notification.service';
import type { Notification } from './interfaces/notification.interface';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitSubscriber: RabbitSubscriber,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit(): void {
    this.rabbitSubscriber.subscribe<Notification>(NOTIFICATION_MESSAGE, (message) =>
      this.notificationService.send(message),
    );
  }
}
