import { Field, ObjectType } from '@nestjs/graphql';
import { CartVariantDto } from '../dto/cart-variant.dto';

@ObjectType()
export class CartItemModel {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => [CartVariantDto])
  variants: CartVariantDto[];
}
