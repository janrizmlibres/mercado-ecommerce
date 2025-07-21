import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CookieRequest } from '../interfaces';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../dto';

interface RequestWithUser {
  user: UserDto;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CookieRequest>();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap({
          next: (res) => {
            context.switchToHttp().getRequest<RequestWithUser>().user = res;
          },
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
