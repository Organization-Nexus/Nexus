import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('email-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('password-reset')
  async handlePasswordReset(job: Job) {
    const { email, context } = job.data;

    try {
      this.logger.log(`비밀번호 재설정 이메일 전송 시작: ${email}`);
      await job.progress(50);

      await this.mailerService.sendMail({
        to: email,
        subject: '비밀번호 재설정 코드',
        template: 'password-reset',
        context,
      });

      await job.progress(100);
      this.logger.log(`비밀번호 재설정 이메일 전송 완료: ${email}`);
    } catch (error) {
      this.logger.error(`이메일 전송 실패: ${email}`, error.stack);
      throw error;
    }
  }
}
