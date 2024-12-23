// 본인확인용 guard

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ForbiddenAccessException } from '../exception/auth.exception';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetId = Number(request.params.id); // params 로 받을때

    // const targetId = user.id; // 토큰으로 확인할때 (본인)

    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.id !== targetId) {
      throw new ForbiddenAccessException();
    }

    return true;
  }
}
