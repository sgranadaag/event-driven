import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from '@core/rabbit/rabbit.module';
import { AnnouncementModule } from '@modules/announcement/announcement.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { OrderModule } from '@modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitModule,
    OrderModule,
    NotificationModule,
    AnnouncementModule,
  ],
})
export class AppModule {}
