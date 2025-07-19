import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({})
export class ConfigModule {
  static forRoot(
    options: Omit<ConfigModuleOptions, 'validationSchema'>,
  ): Promise<DynamicModule> {
    return NestConfigModule.forRoot({
      ...options,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    });
  }
}
