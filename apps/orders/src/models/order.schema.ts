import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class OrderDocument extends AbstractDocument {
  @Prop()
  userId: string;

  @Prop()
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @Prop()
  totalPrice: number;

  @Prop()
  orderItems: string[];

  @Prop()
  invoiceId: string;

  @Prop()
  timestamp: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
