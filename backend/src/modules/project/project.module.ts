import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectUserModule } from '../project-user/project-user.module';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { CommunityModule } from '../community/community.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectUser]),
    CommunityModule,
    FileModule,
    ProjectUserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
