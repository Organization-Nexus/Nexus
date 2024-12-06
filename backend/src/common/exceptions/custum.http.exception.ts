import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

// 400	HttpStatus.BAD_REQUEST	잘못된 요청. 입력 값 검증 실패 또는 비즈니스 로직에서 문제 발생 시.
// 401	HttpStatus.UNAUTHORIZED	인증이 필요하거나 인증에 실패했을 때.
// 403	HttpStatus.FORBIDDEN	권한이 없어 접근이 거부되었을 때.
// 404	HttpStatus.NOT_FOUND	리소스를 찾을 수 없을 때.
// 409	HttpStatus.CONFLICT	리소스 충돌. 중복 데이터 또는 상태 충돌 발생 시.
// 422	HttpStatus.UNPROCESSABLE_ENTITY	요청은 이해되었으나 처리할 수 없는 경우. 주로 데이터 유효성 검사 실패 시.
// 500	HttpStatus.INTERNAL_SERVER_ERROR	서버 내부에서 예기치 않은 오류가 발생했을 때.
