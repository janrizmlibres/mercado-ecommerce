import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VariantDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  options: string[];
}
