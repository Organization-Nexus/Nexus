import { Injectable } from '@nestjs/common';
import { PingException } from './exception/ping.exception';

@Injectable()
export class PingService {
  getPong(): string {
    const shouldThrowError = true; // 테스트를 위해 강제로 예외를 발생시킴
    if (shouldThrowError) {
      throw new PingException();
    }
    return 'pong';
  }
}
