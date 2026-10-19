import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from '@core/rabbit/rabbit.module';
import { OrderModule } from '@modules/order/order.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitModule, OrderModule],
})
export class AppModule {}
