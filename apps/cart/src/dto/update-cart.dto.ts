import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateCartItemDto {
  @IsInt()
  @Field()
  change: number;
}
