import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { OrderDocument, OrderSchema } from './models/order.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
    LoggerModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
