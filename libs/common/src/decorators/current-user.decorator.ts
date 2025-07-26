import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dto';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface RequestWithUser {
  user: UserDto;
}

const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  }

  const gqlContext = GqlExecutionContext.create(context);
  const req = gqlContext.getContext<{ req: Request }>().req;
  const user = req.headers.user as string;

  if (user) {
    return JSON.parse(user) as string;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
