import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus, OrderItem } from '../types/order.types';

@Schema({ _id: false })
export class OrderItemDocument implements OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ versionKey: false })
export class OrderDocument extends AbstractDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: String,
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: [OrderItemDocument], required: true })
  orderItems: OrderItemDocument[];

  @Prop({ required: true })
  invoiceId: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
