import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order as OrderModel } from '../generated/prisma';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderModel> {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string): Promise<OrderModel> {
    return this.ordersService.findUnique(id);
  }

  @Get()
  findMany(): Promise<OrderModel[]> {
    return this.ordersService.findMany();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderModel> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<OrderModel> {
    return this.ordersService.remove(id);
  }
}
