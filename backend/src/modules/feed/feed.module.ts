import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FileModule } from '../file/file.module';
import { Feed } from './entites/feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '../community/entites/community.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed, Community, ProjectUser]),
    FileModule,
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
