import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// pong 실패 에러 처리
export class PingException extends CustomHttpException {
  constructor() {
    super('Ping Failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
