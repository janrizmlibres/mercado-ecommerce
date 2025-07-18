import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../types/order.types';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  orderItems: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
