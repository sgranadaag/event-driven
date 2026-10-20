import { ApiProperty } from '@nestjs/swagger';
import type { PublishOrderResult } from '../interfaces/publishOrder.interface';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';

export class OrderResponseDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRODUCT)
  readonly product: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.QUANTITY)
  readonly quantity: number;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.ROUTED)
  readonly routed: boolean;

  private constructor(
    id: string,
    product: string,
    quantity: number,
    messageId: string,
    routed: boolean,
  ) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.messageId = messageId;
    this.routed = routed;
  }

  static fromResult({ order, messageId, routed }: PublishOrderResult): OrderResponseDto {
    return new OrderResponseDto(
      order.id,
      order.product,
      order.quantity,
      messageId,
      routed,
    );
  }
}
