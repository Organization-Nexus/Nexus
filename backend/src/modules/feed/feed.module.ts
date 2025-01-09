import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FileModule } from '../file/file.module';
import { Feed } from './entites/feed.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { Project } from '../project/entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, ProjectUser, Project]), FileModule],
  controllers: [],
  providers: [FeedService],
})
export class FeedModule {}
