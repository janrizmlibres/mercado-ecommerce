import { Injectable } from '@nestjs/common';
import { PaymentDataDto } from './dto/payment-data.dto';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  async createMayaCheckout(paymentData: PaymentDataDto) {
    const payload = {
      totalAmount: {
        value: paymentData.value,
        currency: 'PHP',
      },
      requestReferenceNumber: paymentData.paymentId,
      items: paymentData.items,
    };

    const res = await axios.post<{ checkoutUrl: string }>(
      'https://pg-sandbox.paymaya.com/checkout/v1/checkouts',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              'pk-lNAUk1jk7VPnf7koOT1uoGJoZJjmAxrbjpj6urB8EIA',
            ).toString('base64'),
        },
      },
    );

    return res.data.checkoutUrl;
  }
}
