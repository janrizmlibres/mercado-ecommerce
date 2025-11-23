import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { setApp } from './app';

const allowedOrigins = [
  'http://localhost:5173',
  'https://mercado-front-production.up.railway.app',
];

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
  setApp(app);
}
void bootstrap();
