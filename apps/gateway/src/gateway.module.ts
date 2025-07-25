import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'orders',
                url: configService.getOrThrow('ORDERS_GRAPHQL_URL'),
              },
            ],
          }),
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    ConfigModule.forRoot(
      './apps/gateway/.env',
      Joi.object({
        PORT: Joi.number().required(),
      }),
    ),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
