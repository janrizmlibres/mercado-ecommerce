import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CartVariantDto } from './cart-variant.dto';
import { Type } from 'class-transformer';

@InputType()
export class CreateCartItemDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  productId: string;

  @IsInt()
  @Field()
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartVariantDto)
  @Field(() => [CartVariantDto])
  variants: CartVariantDto[];
}
