import { Field, ObjectType } from '@nestjs/graphql';
import { OrderVariantDto } from '@app/common';

@ObjectType()
export class CartItemModel {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => [OrderVariantDto])
  variants: OrderVariantDto[];
}
