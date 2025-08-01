import { CreateProductDto } from './create-product.dto';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['variants'] as const),
) {}
