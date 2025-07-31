import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { CartModel } from './models/cart.model';
import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { CartItemModel } from './models/cart-item.model';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CurrentUser, UserDto } from '@app/common';

@Resolver(() => CartModel)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => CartItemModel)
  createItem(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.cartService.createItem(user, createCartItemInput);
  }

  @Query(() => [CartModel], { name: 'cart' })
  find(@CurrentUser() user: UserDto) {
    return this.cartService.find(user);
  }

  @Mutation(() => CartItemModel)
  updateItem(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCartItemInput') updateProductInput: UpdateCartItemDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.cartService.updateItem(id, user, updateProductInput);
  }

  @Mutation(() => CartItemModel)
  removeItem(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.cartService.removeItem(id, user);
  }
}
