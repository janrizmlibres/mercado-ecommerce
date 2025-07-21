import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from './prisma.service';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { orderItems, ...order } = createOrderDto;

    const newOrder = await this.prismaService.order.create({
      data: {
        ...order,
        userId,
        orderItems: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: { orderItems: true },
    });

    const checkoutUrl = this.paymentService.send('create_checkout', {
      value: order.totalPrice,
      paymentId: newOrder.id,
      items: orderItems,
    });

    return { newOrder, checkoutUrl };
  }

  findAll() {
    return this.prismaService.order.findMany({
      include: { orderItems: true },
    });
  }

  findOne(id: string) {
    return this.prismaService.order.findUniqueOrThrow({
      where: { id },
      include: { orderItems: true },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id },
      data: updateOrderDto,
      include: { orderItems: true },
    });
  }

  remove(id: string) {
    return this.prismaService.order.delete({
      where: { id },
      include: { orderItems: true },
    });
  }
}
