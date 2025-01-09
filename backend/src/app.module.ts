import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PingModule } from './modules/ping/ping.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RateLimitingModule } from './modules/rate-limiting/rate-limiting.module';
import { ProjectModule } from './modules/project/project.module';
import { FileModule } from './modules/file/file.module';
import { ProjectUserModule } from './modules/project-user/project-user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { FeedModule } from './modules/feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RateLimitingModule,
    DatabaseModule,
    PingModule,
    LoggerModule.forRoot(),
    AuthModule,
    UserModule,
    ProjectModule,
    FileModule,
    ProjectUserModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <nexus_official@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    FeedModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User : ${process.env.POSTGRES_USER}`,
    );
  }
}
