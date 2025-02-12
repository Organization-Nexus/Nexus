import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FileModule } from '../file/file.module';
import { Feed } from './entites/feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserModule } from '../project-user/project-user.module';
import { CommunityModule } from '../community/community.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed]),
    FileModule,
    ProjectUserModule,
    CommunityModule,
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
