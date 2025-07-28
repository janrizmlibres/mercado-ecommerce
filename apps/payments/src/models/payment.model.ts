import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentModel {
  @Field()
  checkoutId: string;

  @Field()
  redirectUrl: string;
}
