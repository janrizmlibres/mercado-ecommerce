import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { LoggerModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { ConfigModule } from '@app/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'apps/orders/.env' }),
    LoggerModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService],
})
export class OrdersModule {}
