import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectUserModule } from '../project-user/project-user.module';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { CommunityModule } from '../community/community.module';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';
import { MilestoneModule } from '../milestone/milestone.module';
import { IssueModule } from '../issue/issue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectUser]),
    CommunityModule,
    UserModule,
    FileModule,
    ProjectUserModule,
    IssueModule,
    MilestoneModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
