import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { prismaService } from './prisma.service';
import { LoggerModule, ConfigModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env.local',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, prismaService],
})
export class UsersModule {}
