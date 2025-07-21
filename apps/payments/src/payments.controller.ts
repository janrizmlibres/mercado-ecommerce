import { Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDataDto } from './dto/payment-data.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createMayaCheckout(paymentData: PaymentDataDto) {
    return this.paymentsService.createMayaCheckout(paymentData);
  }
}
