import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { MIN_ORDER_QUANTITY } from '../order.constants';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';

export class CreateOrderDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRODUCT)
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.QUANTITY)
  @IsInt()
  @Min(MIN_ORDER_QUANTITY)
  quantity: number;
}
