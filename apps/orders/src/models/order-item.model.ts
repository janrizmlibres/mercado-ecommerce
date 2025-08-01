import { OrderItemModel as ItemModel } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItemModel extends ItemModel {
  @Field()
  orderId: string;
}
