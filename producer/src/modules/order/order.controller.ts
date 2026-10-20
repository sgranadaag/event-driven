import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { OrderService } from './order.service';
import { ORDER_SWAGGER } from './order.swagger';
import { ClassifyOrderDto } from './dto/classifyOrder.dto';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderResponseDto } from './dto/orderResponse.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@ApiTags(ORDER_SWAGGER.API_TAG)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @SwaggerDocs(ORDER_SWAGGER.CREATE, OrderResponseDto)
  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const result = await this.orderService.create({
      product: dto.product,
      quantity: dto.quantity,
    });

    return OrderResponseDto.fromResult(result);
  }

  @SwaggerDocs(ORDER_SWAGGER.UPDATE, OrderResponseDto)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const result = await this.orderService.update(id, {
      product: dto.product,
      quantity: dto.quantity,
    });

    return OrderResponseDto.fromResult(result);
  }

  @SwaggerDocs(ORDER_SWAGGER.CLASSIFY, OrderResponseDto)
  @Post('classify')
  async classify(@Body() dto: ClassifyOrderDto): Promise<OrderResponseDto> {
    const result = await this.orderService.classify({
      product: dto.product,
      quantity: dto.quantity,
      priority: dto.priority,
      region: dto.region,
    });

    return OrderResponseDto.fromResult(result);
  }
}
