import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  CACHE_INSTANCE,
  CART_SERVICE,
  ConfigModule,
  LoggerModule,
} from '@app/common';
import * as Joi from 'joi';
import { PrismaService } from './prisma.service';
import { ProductsResolver } from './products.resolver';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    LoggerModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ConfigModule.forRoot(
      'apps/products/.env',
      Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        CART_HOST: Joi.string().optional(),
        CART_PORT: Joi.number().optional(),
      }),
    ),
    ClientsModule.registerAsync([
      {
        name: CART_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CART_HOST') || '0.0.0.0',
            port: configService.get('CART_PORT') || 3020,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    ProductsResolver,
    {
      provide: CACHE_INSTANCE,
      useFactory: (configService: ConfigService) => {
        const secondary = createKeyv(configService.getOrThrow('REDIS_URL'));
        return new Cacheable({ secondary, ttl: '48h' });
      },
      inject: [ConfigService],
    },
  ],
})
export class ProductsModule {}
