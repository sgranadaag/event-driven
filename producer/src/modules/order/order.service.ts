import { Injectable } from '@nestjs/common';
import { RabbitPublisher } from '@core/rabbit/rabbit.publisher';
import { generateId } from '@utils/crypto.util';
import { ORDER_CREATED_EVENT } from './order.constants';
import type { Order } from './interfaces/order.interface';
import type {
  CreateOrderInput,
  CreateOrderResult,
} from './interfaces/createOrder.interface';

@Injectable()
export class OrderService {
  constructor(private readonly rabbitPublisher: RabbitPublisher) {}

  async create({ product, quantity }: CreateOrderInput): Promise<CreateOrderResult> {
    const order: Order = {
      id: generateId(),
      product,
      quantity,
      createdAt: new Date().toISOString(),
    };

    const eventId = await this.rabbitPublisher.publish(ORDER_CREATED_EVENT, order);

    return { order, eventId };
  }
}
