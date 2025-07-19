import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { Status } from '.prisma/client';

export class CreateOrderDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

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
