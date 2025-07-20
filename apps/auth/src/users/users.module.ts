import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { prismaService } from './prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, prismaService],
})
export class UsersModule {}
