import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
export class OrderVariantModel {
  @Field()
  name: string;

  @Field()
  value: string;
}
