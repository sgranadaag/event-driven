import { Injectable } from '@nestjs/common';
import { EMPTY_ROUTING_KEY } from '@core/rabbit/rabbit.constants';
import { RabbitPublisher } from '@core/rabbit/rabbit.publisher';
import { RABBIT_SCHEMA } from '@core/rabbit/rabbit.schema';
import { generateId } from '@utils/crypto.util';
import {
  ORDER_CREATE_MESSAGE,
  ORDER_PRIORITIZE_MESSAGE,
  ORDER_UPDATE_MESSAGE,
} from './order.constants';
import type { Order, OrderPriority } from './interfaces/order.interface';
import type {
  OrderInput,
  PrioritizeOrderInput,
  PublishOrderPriorityResult,
  PublishOrderResult,
} from './interfaces/publishOrder.interface';

@Injectable()
export class OrderService {
  constructor(private readonly rabbitPublisher: RabbitPublisher) {}

  async create({ product, quantity }: OrderInput): Promise<PublishOrderResult> {
    const order: Order = { id: generateId(), product, quantity };

    const { messageId, routed } = await this.rabbitPublisher.publish({
      exchange: RABBIT_SCHEMA.exchanges.orders.name,
      routingKey: ORDER_CREATE_MESSAGE,
      type: ORDER_CREATE_MESSAGE,
      payload: order,
    });

    return { order, messageId, routed };
  }

  async update(
    id: string,
    { product, quantity }: OrderInput,
  ): Promise<PublishOrderResult> {
    const order: Order = { id, product, quantity };

    const { messageId, routed } = await this.rabbitPublisher.publish({
      exchange: RABBIT_SCHEMA.exchanges.orders.name,
      routingKey: ORDER_UPDATE_MESSAGE,
      type: ORDER_UPDATE_MESSAGE,
      payload: order,
    });

    return { order, messageId, routed };
  }

  async prioritize(
    id: string,
    { priority, region }: PrioritizeOrderInput,
  ): Promise<PublishOrderPriorityResult> {
    const orderPriority: OrderPriority = { id, priority, region };

    const { messageId, routed } = await this.rabbitPublisher.publish({
      exchange: RABBIT_SCHEMA.exchanges.orderAttributes.name,
      routingKey: EMPTY_ROUTING_KEY,
      type: ORDER_PRIORITIZE_MESSAGE,
      payload: orderPriority,
      headers: { priority, region },
    });

    return { orderPriority, messageId, routed };
  }
}
