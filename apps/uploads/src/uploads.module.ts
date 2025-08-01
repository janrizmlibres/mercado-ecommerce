import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(
      'apps/uploads/.env',
      Joi.object({
        PORT: Joi.number().required(),
      }),
    ),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
