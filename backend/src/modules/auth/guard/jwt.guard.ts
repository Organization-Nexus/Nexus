import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard - canActivate 실행');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JwtAuthGuard - handleRequest 실행');
    console.log('error:', err);
    console.log('user:', user);
    console.log('info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
