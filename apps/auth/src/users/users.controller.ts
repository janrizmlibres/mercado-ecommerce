import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User as UserModel } from '../generated/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserModel) {
    return user;
  }
}
