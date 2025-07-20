import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserModel } from '.prisma/client';

interface RequestWithUser {
  user: UserModel;
}

const getCurrentUserByContext = (context: ExecutionContext): UserModel => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
