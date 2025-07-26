import { CreateOrderDto } from './create-order.dto';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDto extends OmitType(CreateOrderDto, [
  'orderItems',
] as const) {}
