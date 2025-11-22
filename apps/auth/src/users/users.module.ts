import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from './prisma.service';
import { UsersResolver } from './users.resolver';
import { CACHE_INSTANCE, CART_SERVICE } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { createKeyv, Cacheable } from 'cacheable';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CART_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: 3020,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UsersResolver,
    {
      provide: CACHE_INSTANCE,
      useFactory: (configService: ConfigService) => {
        const secondary = createKeyv(configService.getOrThrow('REDIS_URL'));
        return new Cacheable({ secondary, ttl: 1000 * 60 * 5 });
      },
      inject: [ConfigService],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
