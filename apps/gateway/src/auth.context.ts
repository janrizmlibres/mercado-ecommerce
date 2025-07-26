import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, UserDto } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { Request } from 'express';
import { app } from './app';

export const authContext = async ({ req }: { req: Request }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);

    const user = await lastValueFrom<UserDto>(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );
    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
