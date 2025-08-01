import { Field, ObjectType } from '@nestjs/graphql';
import { OrderVariantModel } from '@app/common';

@ObjectType()
export class CartItemModel {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => [OrderVariantModel])
  variants: OrderVariantModel[];
}
