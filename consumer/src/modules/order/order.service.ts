import { Injectable, Logger } from '@nestjs/common';
import type { ConsumedEvent } from '@interfaces/consumedEvent.interface';
import type { Order } from './interfaces/order.interface';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  handleCreated({ id, redelivered, payload: order }: ConsumedEvent<Order>): void {
    const redeliveredLabel = redelivered ? ', redelivered' : '';

    this.logger.log(
      `Order ${order.id}: ${order.quantity} x ${order.product} (event ${id}${redeliveredLabel})`,
    );
  }
}
