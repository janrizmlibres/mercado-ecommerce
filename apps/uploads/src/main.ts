import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { UploadsModule } from './uploads.module';

const allowedOrigins = [
  'http://localhost:5173',
  'https://mercado-front-production.up.railway.app',
];

async function bootstrap() {
  const app = await NestFactory.create(UploadsModule);
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT')!);
}
void bootstrap();
