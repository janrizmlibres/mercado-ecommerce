import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { UploadsModule } from './uploads.module';

async function bootstrap() {
  const app = await NestFactory.create(UploadsModule);
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT')!);
}
void bootstrap();
