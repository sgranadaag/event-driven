import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitSubscriber } from '@core/rabbit/rabbit.subscriber';
import {
  ORDER_CLASSIFIED_MESSAGE,
  ORDER_CREATE_MESSAGE,
} from './order.constants';
import { OrderService } from './order.service';
import type { Order } from './interfaces/order.interface';

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
    this.rabbitSubscriber.subscribe<Order>(ORDER_CLASSIFIED_MESSAGE, (message) =>
      this.orderService.handleClassified(message),
    );
  }
}
