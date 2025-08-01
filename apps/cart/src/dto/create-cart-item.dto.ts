import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderVariantDto } from '@app/common';

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
  @Type(() => OrderVariantDto)
  @Field(() => [OrderVariantDto])
  variants: OrderVariantDto[];
}
