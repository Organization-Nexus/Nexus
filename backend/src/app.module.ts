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
import { VoteModule } from './modules/vote/vote.module';
import { FeedModule } from './modules/feed/feed.module';
import { MailModule } from './modules/mailer/mailer.module';
import { MinutesModule } from './modules/minutes/minutes.module';
import { LikeModule } from './modules/like/like.module';
import { MilestoneModule } from './modules/milestone/milestone.module';
import { IssueModule } from './modules/issue/issue.module';

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
    FeedModule,
    VoteModule,
    MailModule,
    MinutesModule,
    LikeModule,
    MilestoneModule,
    IssueModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User: ${process.env.POSTGRES_USER}`,
    );
  }
}
