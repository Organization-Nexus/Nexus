import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class UnauthorizedMinutesException extends CustomHttpException {
  constructor(projectUserId: number) {
    super(
      `이 회의록에 대한 수정 및 삭제 권한이 없습니다. 🥲`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class NotFoundMinutesException extends CustomHttpException {
  constructor(minutesId: number) {
    super(
      `회의록 ${minutesId}를/을 찾을 수 없습니다. 🥲`,
      HttpStatus.NOT_FOUND,
    );
  }
}
