import { Module } from '@nestjs/common';
import { NotificationConsumer } from './notification.consumer';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationConsumer, NotificationService],
})
export class NotificationModule {}
