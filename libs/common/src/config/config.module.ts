import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export class ConfigModule {
  static forRoot(envFilePath: string, objectSchema?: Joi.ObjectSchema) {
    return NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: objectSchema,
    });
  }
}
