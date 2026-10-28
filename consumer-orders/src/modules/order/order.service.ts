import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/rabbit.interface';
import { PRIORITY_HANDLING_BY_QUEUE } from './order.constants';
import type { Order, OrderPriority } from './interfaces/order.interface';
import { toLogFields } from '@utils/log.util';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  create({ payload: order }: ConsumedMessage<Order>): void {
    this.logger.log(
      `Order created ${toLogFields({ product: order.product, quantity: order.quantity })}`,
    );
  }

  update({ payload: order }: ConsumedMessage<Order>): void {
    this.logger.log(
      `Order updated ${toLogFields({ product: order.product, quantity: order.quantity })}`,
    );
  }

  prioritize({ queue, payload: orderPriority }: ConsumedMessage<OrderPriority>): void {
    this.logger.log(
      `Order prioritized ${toLogFields({
        handling: PRIORITY_HANDLING_BY_QUEUE[queue] ?? queue,
        priority: orderPriority.priority,
        region: orderPriority.region,
      })}`,
    );
  }
}
