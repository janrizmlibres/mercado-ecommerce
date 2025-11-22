import { Status } from '../generated/client';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderItemModel } from './order-item.model';

registerEnumType(Status, { name: 'Status' });

@ObjectType()
export class OrderModel {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => Status)
  status: Status;

  @Field()
  totalPrice: number;

  @Field(() => [OrderItemModel])
  orderItems: OrderItemModel[];

  @Field()
  invoiceId: string;

  @Field()
  timestamp: Date;
}
