import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// 로그인 실패 (이메일 또는 비밀번호 오류)
export class LoginFailedException extends CustomHttpException {
  constructor() {
    super('이메일과 비밀번호를 다시 확인해주세요.', HttpStatus.BAD_REQUEST);
  }
}

// 이름 길이 제한
export class NameLengthException extends CustomHttpException {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 5;
  constructor() {
    super(
      `이름은 ${NameLengthException.MIN_LENGTH}자 이상 ${NameLengthException.MAX_LENGTH}자 이하여야 합니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  static getMinLength() {
    return this.MIN_LENGTH;
  }
  static getMaxLength() {
    return this.MAX_LENGTH;
  }
}

// 이메일 형식
export class InvalidEmailFormatException extends CustomHttpException {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor() {
    super('올바른 이메일 형식이 아닙니다.', HttpStatus.BAD_REQUEST);
  }

  static isValid(email: string): boolean {
    return this.EMAIL_PATTERN.test(email);
  }
}

// 비밀번호 형식
export class InvalidPasswordFormatException extends CustomHttpException {
  constructor() {
    super(
      '비밀번호는 8-20자의 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.',
      HttpStatus.BAD_REQUEST,
    );
  }

  static readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

  static isValid(password: string): boolean {
    return this.PASSWORD_REGEX.test(password);
  }
}

// 이메일 중복
export class EmailAlreadyExistsException extends CustomHttpException {
  constructor(email: string) {
    super(`이미 ${email}로 가입된 사용자가 존재합니다.`, HttpStatus.CONFLICT);
  }
}

// 전화번호 형식
export class InvalidPhoneNumberException extends CustomHttpException {
  private static readonly PHONE_PATTERN = /^010[0-9]{7,8}$/;

  constructor() {
    super('올바른 전화번호 형식이 아닙니다.', HttpStatus.BAD_REQUEST);
  }

  static isValid(phone: string): boolean {
    return this.PHONE_PATTERN.test(phone);
  }
}

// Github 주소 형식
export class InvalidGithubUrlException extends CustomHttpException {
  private static readonly GITHUB_PATTERN =
    /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/;

  constructor() {
    super('올바른 Github 주소가 아닙니다.', HttpStatus.BAD_REQUEST);
  }

  static isValid(url: string): boolean {
    return this.GITHUB_PATTERN.test(url);
  }
}

export class VerificationCodeRequiredException extends CustomHttpException {
  constructor() {
    super('인증번호를 입력해주세요.', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidVerificationCodeException extends CustomHttpException {
  private static readonly CODE_LENGTH = 6;

  constructor() {
    super('잘못된 인증번호입니다.', HttpStatus.BAD_REQUEST);
  }

  static getCodeLength() {
    return this.CODE_LENGTH;
  }
}

export class VerificationCodeExpiredException extends CustomHttpException {
  private static readonly EXPIRE_MINUTES = 3;

  constructor() {
    super('인증번호가 만료되었습니다.', HttpStatus.BAD_REQUEST);
  }

  static getExpireMinutes() {
    return this.EXPIRE_MINUTES;
  }
}

export class EmailSendRateLimitException extends CustomHttpException {
  private static readonly RATE_LIMIT_MINUTES = 1;

  constructor() {
    super(
      '요청 횟수를 초과했습니다. 메일은 1분에 한 번만 전송 가능합니다.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  static getRateLimitMinutes() {
    return this.RATE_LIMIT_MINUTES;
  }
}

// 유효하지 않은 접근(JWT 만료 또는 유효하지 않은 토큰)
export class UnauthorizedAccessException extends CustomHttpException {
  constructor() {
    super('유효하지 않은 접근입니다.', HttpStatus.UNAUTHORIZED);
  }
}

// 유효하지 않은 리프레시 토큰
export class UnauthorizedRefreshToken extends CustomHttpException {
  constructor() {
    super('유효하지 않은 리프레시 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

// 접근 권한 없음
export class ForbiddenAccessException extends CustomHttpException {
  constructor() {
    super('접근 권한이 없습니다.', HttpStatus.FORBIDDEN);
  }
}
