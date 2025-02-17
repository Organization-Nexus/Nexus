import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { FeedModule } from '../feed/feed.module';
import { VoteModule } from '../vote/vote.module';
import { ProjectUserModule } from '../project-user/project-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    FeedModule,
    VoteModule,
    ProjectUserModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
