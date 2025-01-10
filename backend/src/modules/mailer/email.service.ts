import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {}

  async sendPasswordResetEmail(email: string, context: any) {
    await this.emailQueue.add(
      'password-reset',
      { email, context },
      {
        attempts: 3, // 실패시 3번 재시도
        backoff: {
          type: 'exponential',
          delay: 1000, // 첫 재시도까지 1초 대기
        },
        removeOnComplete: true, // 성공적으로 완료된 작업 삭제
        removeOnFail: false, // 실패한 작업은 유지 (디버깅용)
      },
    );
  }
}
