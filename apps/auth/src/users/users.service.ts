import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
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

  async getUser(getUserDto: GetUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: getUserDto.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
