import { Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createMayaCheckout(paymentData: CreatePaymentDto) {
    return this.paymentsService.createMayaCheckout(paymentData);
  }
}
