import { ApiProperty } from '@nestjs/swagger';
import type { OrderPriorityLevel } from '../interfaces/order.interface';
import type { PublishOrderPriorityResult } from '../interfaces/publishOrder.interface';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';

export class OrderPriorityResponseDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.ID)
  readonly id: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRIORITY)
  readonly priority: OrderPriorityLevel;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.REGION)
  readonly region: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.MESSAGE_ID)
  readonly messageId: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.ROUTED)
  readonly routed: boolean;

  private constructor(
    id: string,
    priority: OrderPriorityLevel,
    region: string,
    messageId: string,
    routed: boolean,
  ) {
    this.id = id;
    this.priority = priority;
    this.region = region;
    this.messageId = messageId;
    this.routed = routed;
  }

  static fromResult({
    orderPriority,
    messageId,
    routed,
  }: PublishOrderPriorityResult): OrderPriorityResponseDto {
    return new OrderPriorityResponseDto(
      orderPriority.id,
      orderPriority.priority,
      orderPriority.region,
      messageId,
      routed,
    );
  }
}
