import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { LoggerModule, ConfigModule } from '@app/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LoggerModule, ConfigModule.forRoot('./apps/orders/.env')],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
