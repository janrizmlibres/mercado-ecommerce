import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

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

  @IsNumber()
  @Field()
  price: number;

  @IsInt()
  @Field()
  stock: number;
}
