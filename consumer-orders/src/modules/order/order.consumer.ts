import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitSubscriber } from '@core/rabbit/rabbit.subscriber';
import {
  ORDER_CREATE_MESSAGE,
  ORDER_PRIORITIZE_MESSAGE,
  ORDER_UPDATE_MESSAGE,
} from './order.constants';
import { OrderService } from './order.service';
import type { Order, OrderPriority } from './interfaces/order.interface';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitSubscriber: RabbitSubscriber,
    private readonly orderService: OrderService,
  ) {}

  onModuleInit(): void {
    this.rabbitSubscriber.subscribe<Order>(ORDER_CREATE_MESSAGE, (message) =>
      this.orderService.create(message),
    );
    this.rabbitSubscriber.subscribe<Order>(ORDER_UPDATE_MESSAGE, (message) =>
      this.orderService.update(message),
    );
    this.rabbitSubscriber.subscribe<OrderPriority>(ORDER_PRIORITIZE_MESSAGE, (message) =>
      this.orderService.prioritize(message),
    );
  }
}
