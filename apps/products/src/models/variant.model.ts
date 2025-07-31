import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariantModel {
  @Field()
  productId: string;

  @Field()
  name: string;

  @Field(() => [String])
  options: string[];
}
