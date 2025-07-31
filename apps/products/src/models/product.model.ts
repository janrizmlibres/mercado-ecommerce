import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from '.prisma/client';
import { VariantDto } from '../dto/variant.dto';

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

  @Field(() => [VariantDto])
  variant: VariantDto[];

  @Field()
  price: number;

  @Field()
  stock: number;
}
