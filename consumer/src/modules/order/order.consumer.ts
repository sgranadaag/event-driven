import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitSubscriber } from '@core/rabbit/rabbit.subscriber';
import { ORDER_CREATED_EVENT } from './order.constants';
import { OrderService } from './order.service';
import type { Order } from './interfaces/order.interface';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitSubscriber: RabbitSubscriber,
    private readonly orderService: OrderService,
  ) {}

  onModuleInit(): void {
    this.rabbitSubscriber.subscribe<Order>(ORDER_CREATED_EVENT, (event) =>
      this.orderService.handleCreated(event),
    );
  }
}
