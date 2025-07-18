import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
