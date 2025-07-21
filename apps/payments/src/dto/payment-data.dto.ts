import { OrderItemDto } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentDataDto {
  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
