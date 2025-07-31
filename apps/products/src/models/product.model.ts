import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from '.prisma/client';
import { VariantModel } from './variant.model';

registerEnumType(Category, { name: 'Category' });

@ObjectType()
export class ProductModel {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  imageUrls: string[];

  @Field(() => Category)
  category: Category;

  @Field(() => [VariantModel])
  variant: VariantModel[];

  @Field()
  price: number;

  @Field()
  stock: number;
}
