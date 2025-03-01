import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Feed } from 'src/modules/feed/entites/feed.entity';
import { Vote } from 'src/modules/vote/entities/vote.entity';
import { ProjectUserModule } from '../project-user/project-user.module';
import { FeedModule } from '../feed/feed.module';
import { VoteModule } from '../vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, ProjectUser, Feed, Vote]),
    ProjectUserModule,
    FeedModule,
    VoteModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
