import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Order, Prisma } from '../generated/prisma';

@Injectable()
export class OrdersRepository {
  protected readonly logger = new Logger(OrdersRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
    });
  }

  async findUnique(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
      include: { orderItems: true },
    });

    if (!order) {
      this.logger.warn('Order was not found', orderWhereUniqueInput);
      throw new NotFoundException('Order was not found');
    }

    return order;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Order[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const orders = await this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { orderItems: true },
    });

    if (!orders || orders.length === 0) {
      this.logger.warn('Orders were not found', where);
      throw new NotFoundException('Orders were not found');
    }

    return orders;
  }

  async update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;
    const order = await this.prisma.order.update({
      data,
      where,
    });

    if (!order) {
      this.logger.warn('Order was not found', where);
      throw new NotFoundException('Order was not found');
    }

    return order;
  }

  async delete(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prisma.order.delete({
      where,
    });
  }
}
