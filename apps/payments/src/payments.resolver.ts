import { Query, Resolver } from '@nestjs/graphql';
import { PaymentModel } from './models/payment.model';
import { PaymentsService } from './payments.service';

@Resolver(() => PaymentModel)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [PaymentModel], { name: 'payments' })
  findAll() {
    this.paymentsService.getPayments();
  }
}
