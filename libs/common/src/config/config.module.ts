import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export class ConfigModule {
  static forRoot(envFilePath: string, objectSchema?: Joi.PartialSchemaMap) {
    const baseSchema = Joi.object({
      DATABASE_URL: Joi.string().required(),
    });

    return NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: objectSchema
        ? baseSchema.keys(objectSchema)
        : baseSchema,
    });
  }
}
