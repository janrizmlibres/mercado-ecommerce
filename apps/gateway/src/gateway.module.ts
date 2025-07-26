import { Module } from '@nestjs/common';
import { AUTH_SERVICE, ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { authContext } from './auth.context';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        server: {
          context: authContext,
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'orders',
                url: configService.getOrThrow('ORDERS_GRAPHQL_URL'),
              },
              {
                name: 'auth',
                url: configService.getOrThrow('AUTH_GRAPHQL_URL'),
              },
            ],
          }),
          buildService: ({ url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest: ({ request, context }) => {
                request.http?.headers.set(
                  'user',
                  context.user ? JSON.stringify(context.user) : '',
                );
              },
            });
          },
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('AUTH_HOST'),
            port: configService.getOrThrow('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule.forRoot(
      './apps/gateway/.env',
      Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.string().required(),
        ORDERS_GRAPHQL_URL: Joi.string().required(),
      }),
    ),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
