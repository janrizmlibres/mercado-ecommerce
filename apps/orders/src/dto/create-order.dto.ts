import { IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from '@app/common';
import { Status } from '../generated/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderDto {
  @IsEnum(Status)
  @Field(() => Status)
  status: Status;

  @IsNumber()
  @Field()
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @Field(() => [OrderItemDto])
  orderItems: OrderItemDto[];
}
