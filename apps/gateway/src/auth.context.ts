import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, UserDto } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { Request } from 'express';
import { app } from './app';

export const authContext = async ({ req }: { req: Request }) => {
  // Return empty context immediately if no auth header to avoid any processing for public queries
  if (!req.headers?.authentication) {
    return { user: null };
  }

  try {
    if (!app) {
      // If app is not ready, we can't authenticate, but we shouldn't crash.
      return { user: null };
    }

    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    if (!authClient) return { user: null };

    const user = await lastValueFrom<UserDto>(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );
    return { user };
  } catch (error) {
    // Log error but don't crash the request
    console.warn('Auth context failure:', error);
    return { user: null };
  }
};
