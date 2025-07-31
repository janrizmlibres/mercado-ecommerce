import { CreateProductDto } from './create-product.dto';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto extends OmitType(CreateProductDto, [
  'variants',
]) {}
