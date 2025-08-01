import { Field, ObjectType } from '@nestjs/graphql';
import { OrderVariantModel } from './order-variant.model';

@ObjectType()
export class OrderItemModel {
  @Field()
  productId: string;

  @Field()
  name: string;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field(() => [OrderVariantModel])
  variants: OrderVariantModel[];
}
