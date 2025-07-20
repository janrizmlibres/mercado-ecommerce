import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { LoggerModule, ConfigModule, AUTH_SERVICE } from '@app/common';
import { PrismaService } from './prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot('./apps/orders/.env', {
      PORT: Joi.number().required(),
      AUTH_HOST: Joi.string().required(),
      AUTH_PORT: Joi.number().required(),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
