import { CreateOrderDto } from './create-order.dto';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['orderItems'] as const),
) {}
