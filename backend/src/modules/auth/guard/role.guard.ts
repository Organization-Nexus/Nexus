import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 핸들러에서 설정된 허용된 역할 가져오기
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log('roles:', requiredRoles);
    if (!requiredRoles) {
      return true; // 역할 제한이 없으면 접근 허용
    }

    // 요청의 사용자 정보에서 역할 확인
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 요청의 사용자 정보 (JWT 등을 통해 설정)
    console.log('User in RoleGuard:', user);
    return requiredRoles.includes(user.role); // 사용자의 역할이 허용된 역할에 포함되는지 확인
  }
}
