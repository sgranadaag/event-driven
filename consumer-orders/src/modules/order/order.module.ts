import { Module } from '@nestjs/common';
import { OrderConsumer } from './order.consumer';
import { OrderService } from './order.service';

@Module({
  providers: [OrderConsumer, OrderService],
})
export class OrderModule {}
