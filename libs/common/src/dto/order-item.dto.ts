import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
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
}
