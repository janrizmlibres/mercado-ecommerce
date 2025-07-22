import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';

@Module({
  imports: [
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
