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
import { CommunityModule } from './modules/community/community.module';
import { NoticeModule } from './modules/notice/notice.module';
import { VoteModule } from './modules/vote/vote.module';

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
    CommunityModule,
    NoticeModule,
    VoteModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User : ${process.env.POSTGRES_USER}`,
    );
  }
}
