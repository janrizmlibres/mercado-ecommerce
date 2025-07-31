import { Field, ObjectType } from '@nestjs/graphql';
import { CartVariantModel } from './cart-variant.model';

@ObjectType()
export class CartItemModel {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => [CartVariantModel])
  variants: CartVariantModel[];
}
