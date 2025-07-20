import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user: object;
}

const getCurrentUserByContext = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
