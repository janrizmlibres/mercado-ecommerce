import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderItem } from '../types/order.types';

export class OrderItemDto implements OrderItem {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

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
