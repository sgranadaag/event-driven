import { ApiProperty } from '@nestjs/swagger';
import { IsIn, Matches } from 'class-validator';
import { ORDER_PRIORITIES, REGION_CODE_PATTERN } from '../order.constants';
import type { OrderPriorityLevel } from '../interfaces/order.interface';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';

export class PrioritizeOrderDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRIORITY)
  @IsIn(ORDER_PRIORITIES)
  priority: OrderPriorityLevel;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.REGION)
  @Matches(REGION_CODE_PATTERN)
  region: string;
}
