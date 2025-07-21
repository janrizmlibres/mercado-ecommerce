import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  async createMayaCheckout(paymentData: CreatePaymentDto) {
    const payload = {
      totalAmount: {
        value: paymentData.value,
        currency: 'PHP',
      },
      requestReferenceNumber: paymentData.paymentId,
      items: paymentData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        totalAmount: {
          value: item.price,
        },
      })),
    };

    const res = await axios.post<{ redirectUrl: string }>(
      'https://pg-sandbox.paymaya.com/checkout/v1/checkouts',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              'pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF:',
            ).toString('base64'),
        },
      },
    );

    return res.data.redirectUrl;
  }
}
