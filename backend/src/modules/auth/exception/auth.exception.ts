import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// 로그인 실패 (이메일 또는 비밀번호 오류)
export class LoginFailedException extends CustomHttpException {
  constructor() {
    super(
      '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// // 이메일 일치하지 않음
// export class EmailNotMatchException extends CustomHttpException {
//   constructor(email: string) {
//     super(
//       `입력하신 이메일(${email})이 기록된 이메일과 일치하지 않습니다.`,
//       HttpStatus.BAD_REQUEST,
//     );
//   }
// }

// // 비밀번호 일치하지 않음
// export class PasswordMismatchException extends CustomHttpException {
//   constructor() {
//     super('입력하신 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
//   }
// }

// 이메일 중복
export class EmailAlreadyExistsException extends CustomHttpException {
  constructor(email: string) {
    super(
      `이미 ${email}로 가입된 사용자가 존재합니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

// 유효하지 않은 접근(JWT 만료 또는 유효하지 않은 토큰)
export class UnauthorizedAccessException extends CustomHttpException {
  constructor() {
    super('유효하지 않은 접근입니다.', HttpStatus.UNAUTHORIZED);
  }
}
