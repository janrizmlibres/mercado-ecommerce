import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CACHE_INSTANCE, ConfigModule, LoggerModule } from '@app/common';
import { CartResolver } from './cart.resolver';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

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
      'apps/cart/.env',
      Joi.object({
        REDIS_URL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    ),
  ],
  providers: [
    CartService,
    CartResolver,
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
export class CartModule {}
