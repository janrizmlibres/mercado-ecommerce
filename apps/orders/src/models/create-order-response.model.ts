import { Field, ObjectType } from '@nestjs/graphql';
import { OrderModel } from './order.model';

@ObjectType()
export class CreateOrderResponseModel {
  @Field(() => OrderModel)
  order: OrderModel;

  @Field()
  redirectUrl: string;
}
