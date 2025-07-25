import { OrderItemDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItemModel extends OrderItemDto {
  @Field()
  orderId: string;
}
