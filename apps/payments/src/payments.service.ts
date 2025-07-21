import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';
import { CheckoutDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

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

    const res = await axios.post<CheckoutDto>(
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

    this.notificationsService.emit('notify_email', {
      email: paymentData.email,
    });

    return res.data;
  }
}
