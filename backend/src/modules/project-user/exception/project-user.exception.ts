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
      `사용자 ${userId}은 프로젝트 ${projectId}의 멤버가 아닙니다. 🥲`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AlreadyProjectMemberException extends CustomHttpException {
  constructor(email: string, projectId: number) {
    super(
      `사용자 ${email}은/는 이미 ${projectId} 프로젝트의 멤버입니다. 🧑‍🚀`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ThisBroIsAlreadyProjectMemberException extends CustomHttpException {
  constructor(userId: number) {
    super(
      `${userId}번 사용자는 이미 프로젝트 멤버입니다. 🥲`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class YouCanNotAccessGetOutException extends CustomHttpException {
  constructor(userId: number) {
    super(`${userId}번 사용자는 접근 권한이 없어요. 🥲`, HttpStatus.FORBIDDEN);
  }
}
