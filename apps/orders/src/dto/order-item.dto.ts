import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderItem } from '../types/order.types';

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
