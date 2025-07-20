import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }
}
