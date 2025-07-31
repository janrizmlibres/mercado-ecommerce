import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CartVariantDto } from './cart-variant.dto';

@InputType()
export class CreateCartItemDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  productId: string;

  @IsInt()
  @Field()
  quantity: number;

  @Field(() => [CartVariantDto])
  variants: CartVariantDto[];
}
