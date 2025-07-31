import { Field, ObjectType } from '@nestjs/graphql';
import { CartItemModel } from './cart-item.model';

@ObjectType()
export class CartModel {
  @Field()
  userId: string;

  @Field(() => [CartItemModel])
  items: CartItemModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
