import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'images'),
      serveRoot: '/images',
    }),
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
