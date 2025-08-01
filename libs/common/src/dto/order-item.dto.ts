import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { OrderVariantDto } from './order-variant.dto';
import { Type } from 'class-transformer';

@InputType()
export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNumber()
  @Field()
  quantity: number;

  @IsNumber()
  @Field()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderVariantDto)
  @Field(() => [OrderVariantDto])
  variants: OrderVariantDto[];
}
