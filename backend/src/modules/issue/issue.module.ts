import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserModule } from '../project-user/project-user.module';
import { Issue } from './entities/issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { MilestoneParticipant } from '../milestone/entities/milestone-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, MilestoneParticipant]),
    ProjectUserModule,
  ],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
