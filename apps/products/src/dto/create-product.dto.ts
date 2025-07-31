import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '.prisma/client';

@InputType()
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  imageUrls: string[];

  @IsEnum(Category)
  @Field(() => Category)
  category: Category;

  @IsNumber()
  @Field()
  price: number;

  @IsInt()
  @Field()
  stock: number;
}
