import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserModel)
  async createUser(
    @Args('createUserInput')
    createUserInput: CreateUserDto,
  ) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UserModel], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }
}
