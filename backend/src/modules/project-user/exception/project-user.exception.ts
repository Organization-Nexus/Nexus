import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class ProjectNotFoundException extends CustomHttpException {
  constructor(projectId: number) {
    super(`${projectId} 프로젝트를 찾을 수 없습니다. 🥲`, HttpStatus.NOT_FOUND);
  }
}

export class UserNotFoundException extends CustomHttpException {
  constructor(userId: number) {
    super(`${userId} 사용자를 찾을 수 없습니다. 🥲`, HttpStatus.NOT_FOUND);
  }
}

export class YourNotProjectMemberException extends CustomHttpException {
  constructor(userId: number, projectId: number) {
    super(
      `사용자 ${userId}는 ${projectId}의 프로젝트 멤버가 아닙니다. 🥲`,
      HttpStatus.FORBIDDEN,
    );
  }
}
