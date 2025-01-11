import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class NoPermissionForNoticeException extends CustomHttpException {
  constructor() {
    super('공지사항 작성 권한이 없습니다. 🥲', HttpStatus.FORBIDDEN);
  }
}

export class NoPermissionThisFeedException extends CustomHttpException {
  constructor(userId: number) {
    super(
      `ID가 ${userId}는 현재 피드의 접근권한이 없습니다. 🥲`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class NotFoundFeedException extends CustomHttpException {
  constructor(feedId: number) {
    super(`피드 ${feedId}를 찾을 수 없습니다. 🥲`, HttpStatus.NOT_FOUND);
  }
}
