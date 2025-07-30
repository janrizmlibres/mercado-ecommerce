import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from './prisma.service';
import {
  CACHE_INSTANCE,
  CheckoutDto,
  PAYMENTS_SERVICE,
  UserDto,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cacheable } from 'cacheable';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
    @Inject(CACHE_INSTANCE) private readonly cache: Cacheable,
  ) {}

  async create(createOrderDto: CreateOrderDto, { id: userId, email }: UserDto) {
    const { orderItems, ...order } = createOrderDto;

    const { newOrder, redirectUrl } = await this.prismaService.$transaction(
      async (tx) => {
        let newOrder = await tx.order.create({
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

        newOrder = await tx.order.update({
          where: { id: newOrder.id },
          data: { invoiceId: checkout.checkoutId },
          include: { orderItems: true },
        });

        return { newOrder, redirectUrl: checkout.redirectUrl };
      },
    );

    const cacheKey = `order:${newOrder.id}`;
    await this.cache.set(cacheKey, newOrder);

    return { order: newOrder, redirectUrl };
  }

  findAll() {
    return this.prismaService.order.findMany({
      include: { orderItems: true },
    });
  }

  async findOne(id: string) {
    const cacheKey = `order:${id}`;
    const cachedOrder = await this.cache.get(cacheKey);

    if (!cachedOrder) {
      console.log('Order not cached');

      const order = await this.prismaService.order.findUniqueOrThrow({
        where: { id },
        include: { orderItems: true },
      });

      await this.cache.set(cacheKey, order);
      return order;
    }

    return cachedOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.prismaService.order.update({
      where: { id },
      data: updateOrderDto,
      include: { orderItems: true },
    });

    const cacheKey = `order:${id}`;
    await this.cache.set(cacheKey, updatedOrder);

    return updatedOrder;
  }

  async remove(id: string) {
    const deletedOrder = await this.prismaService.$transaction(async (tx) => {
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

    const cacheKey = `order:${id}`;
    await this.cache.delete(cacheKey);

    return deletedOrder;
  }
}
