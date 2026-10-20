import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedMessage } from '@interfaces/rabbit.interface';
import type { Order } from './interfaces/order.interface';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  create({ payload: order }: ConsumedMessage<Order>): void {
    this.logger.log(`Creating order ${order.id}: ${order.quantity} x ${order.product}`);
  }

  handleClassified({ queue, headers, payload: order }: ConsumedMessage<Order>): void {
    this.logger.log(
      `Order ${order.id} matched "${queue}" with headers ${JSON.stringify(headers)}`,
    );
  }
}
