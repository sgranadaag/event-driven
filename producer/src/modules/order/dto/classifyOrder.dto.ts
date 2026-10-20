import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ORDER_PROPERTY_SWAGGER } from '../order.swagger';
import { CreateOrderDto } from './createOrder.dto';

export class ClassifyOrderDto extends CreateOrderDto {
  @ApiProperty(ORDER_PROPERTY_SWAGGER.PRIORITY)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  priority?: string;

  @ApiProperty(ORDER_PROPERTY_SWAGGER.REGION)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  region?: string;
}
