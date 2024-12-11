import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// 존재하지 않는 사용자
export class UserNotFoundException extends CustomHttpException {
  constructor(userId: string) {
    super(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}

// 계정 정지
export class AccountSuspendedException extends CustomHttpException {
  constructor() {
    super(
      '이 계정은 정지되었습니다. 관리자에게 문의하십시오.',
      HttpStatus.FORBIDDEN,
    );
  }
}

// 사용자 데이터가 잘못됨 (예: 필수 필드가 누락된 경우)
export class InvalidUserDataException extends CustomHttpException {
  constructor() {
    super(
      '사용자 데이터가 잘못되었습니다. 다시 시도하십시오.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
