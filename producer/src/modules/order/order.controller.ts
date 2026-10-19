import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDocs } from '@decorators/swaggerDocs.decorator';
import { OrderService } from './order.service';
import { ORDER_SWAGGER } from './order.swagger';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderResponseDto } from './dto/orderResponse.dto';

@ApiTags(ORDER_SWAGGER.API_TAG)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @SwaggerDocs(ORDER_SWAGGER.CREATE, OrderResponseDto)
  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const { order, eventId } = await this.orderService.create({
      product: dto.product,
      quantity: dto.quantity,
    });

    return OrderResponseDto.fromOrder(order, eventId);
  }
}
