import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// pong 실패 에러 처리
export class PingException extends CustomHttpException {
  constructor() {
    super('Ping Failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

// ------- 이하 줄 부턴 user 사용 예시 ------- //

// 이메일 일치하지 않음
export class EmailNotMatchException extends CustomHttpException {
  constructor(email: string) {
    super(
      `입력하신 이메일(${email})이 기록된 이메일과 일치하지 않습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

// 사용자 존재하지 않음
export class UserNotFoundException extends CustomHttpException {
  constructor(userId: string) {
    super(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
