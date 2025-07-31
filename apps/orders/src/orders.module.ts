import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  LoggerModule,
  ConfigModule,
  AUTH_SERVICE,
  PAYMENTS_SERVICE,
  CACHE_INSTANCE,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { OrdersController } from './orders.controller';
import { OrdersResolver } from './orders.resolver';
import { PrismaService } from './prisma.service';
import * as Joi from 'joi';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    LoggerModule,
    ConfigModule.forRoot(
      './apps/orders/.env',
      Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    ),
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
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    OrdersResolver,
    {
      provide: CACHE_INSTANCE,
      useFactory: (configService: ConfigService) => {
        const secondary = createKeyv(configService.getOrThrow('REDIS_URL'));
        return new Cacheable({ secondary, ttl: 1000 * 60 * 5 });
      },
      inject: [ConfigService],
    },
  ],
})
export class OrdersModule {}
