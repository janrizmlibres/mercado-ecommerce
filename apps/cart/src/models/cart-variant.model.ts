import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartVariantModel {
  @Field()
  name: string;

  @Field()
  value: string;
}
