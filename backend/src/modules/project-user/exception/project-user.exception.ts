import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class ProjectNotFoundException extends CustomHttpException {
  constructor(projectId: number) {
    super(
      `ID가 ${projectId}인 프로젝트를 찾을 수 없습니다. 🥲`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserNotFoundException extends CustomHttpException {
  constructor(userId: number) {
    super(
      `ID가 ${userId}인 사용자를 찾을 수 없습니다. 🥲`,
      HttpStatus.NOT_FOUND,
    );
  }
}
