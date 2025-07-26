import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from './prisma.service';
import { CheckoutDto, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto, { id: userId, email }: UserDto) {
    const { orderItems, ...order } = createOrderDto;

    let newOrder = await this.prismaService.order.create({
      data: {
        ...order,
        userId,
        invoiceId: '',
        orderItems: {
          createMany: {
            data: orderItems,
          },
        },
      },
    });

    const checkout = await firstValueFrom<CheckoutDto>(
      this.paymentService.send('create_checkout', {
        value: order.totalPrice,
        paymentId: newOrder.id,
        items: orderItems,
        email,
      }),
    );

    newOrder = await this.prismaService.order.update({
      where: { id: newOrder.id },
      data: { invoiceId: checkout.checkoutId },
      include: { orderItems: true },
    });

    return { order: newOrder, redirectUrl: checkout.redirectUrl };
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

  async remove(id: string) {
    return await this.prismaService.$transaction(async (tx) => {
      // Fetch order items before deletion
      const orderItemsToDelete = await tx.orderItem.findMany({
        where: { orderId: id },
      });

      // Delete order items
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Delete order
      const deletedOrder = await tx.order.delete({
        where: { id },
        include: { orderItems: true },
      });

      deletedOrder.orderItems = orderItemsToDelete;
      return deletedOrder;
    });
  }
}
