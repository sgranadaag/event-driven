import { ApiProperty } from '@nestjs/swagger';
import type { Order } from '../interfaces/order.interface';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';

export class OrderResponseDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRODUCT)
  readonly product: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.QUANTITY)
  readonly quantity: number;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.CREATED_AT)
  readonly createdAt: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.EVENT_ID)
  readonly eventId: string;

  private constructor(
    id: string,
    product: string,
    quantity: number,
    createdAt: string,
    eventId: string,
  ) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.eventId = eventId;
  }

  static fromOrder(order: Order, eventId: string): OrderResponseDto {
    return new OrderResponseDto(
      order.id,
      order.product,
      order.quantity,
      order.createdAt,
      eventId,
    );
  }
}
