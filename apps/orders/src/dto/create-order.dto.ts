export class CreateOrderDto {
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  orderItems: string[];
  invoiceId: string;
}
