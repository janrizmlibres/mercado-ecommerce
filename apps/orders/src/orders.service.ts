import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { Order as OrderModel } from '../generated/prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...rest } = createOrderDto;

    return this.ordersRepository.create({
      ...rest,
      userId: '123',
      orderItems: {
        createMany: {
          data: orderItems,
        },
      },
    });
  }

  findUnique(id: string): Promise<OrderModel> {
    return this.ordersRepository.findUnique({ id });
  }

  findMany(): Promise<OrderModel[]> {
    return this.ordersRepository.findMany({});
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  remove(id: string) {
    return this.ordersRepository.delete({ id });
  }
}
