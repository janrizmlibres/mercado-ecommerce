import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Status } from '../../generated/prisma';
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
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
