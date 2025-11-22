import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Cacheable } from 'cacheable';
import { CACHE_INSTANCE, CART_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_INSTANCE) private readonly cache: Cacheable,
    @Inject(CART_SERVICE) private readonly cartService: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });

    const cacheKey = `user:${user.id}`;
    await this.cache.set(cacheKey, user);
    return user;
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
    const cacheKey = `user:${getUserDto.id}`;
    const cachedUser = await this.cache.get(cacheKey);
    if (cachedUser) return cachedUser;

    const user = await this.prismaService.user.findUnique({
      where: { id: getUserDto.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.cache.set(cacheKey, user);
    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async remove(id: string) {
    const deletedUser = await this.prismaService.user.delete({
      where: { id },
    });
    const cacheKey = `user:${id}`;
    await this.cache.delete(cacheKey);

    this.cartService.emit('user_deleted', { id });

    return deletedUser;
  }
}
