import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser, UserDto } from '@app/common';
import { OrderModel } from './models/order.model';
import { UpdateOrderDto } from './dto/update-order.dto';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => OrderModel)
  createOrder(
    @Args('createOrderInput')
    createOrderInput: CreateOrderDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.ordersService.create(createOrderInput, user);
  }

  @Query(() => [OrderModel], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => OrderModel, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => OrderModel)
  update(
    @Args('id', { type: () => String }) id: string,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderInput);
  }

  @Mutation(() => OrderModel)
  remove(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.remove(id);
  }
}
