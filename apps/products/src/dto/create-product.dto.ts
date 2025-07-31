import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Category } from '.prisma/client';
import { VariantDto } from './variant.dto';
import { Type } from 'class-transformer';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @Field(() => [VariantDto])
  variants: VariantDto[];

  @IsNumber()
  @Field()
  price: number;

  @IsInt()
  @Field()
  stock: number;
}
