import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigModule, LoggerModule } from '@app/common';
import * as Joi from 'joi';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(
      'apps/products/.env',
      Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
