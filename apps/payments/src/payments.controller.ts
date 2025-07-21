import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_checkout')
  createMayaCheckout(@Payload() paymentData: CreatePaymentDto) {
    return this.paymentsService.createMayaCheckout(paymentData);
  }
}
