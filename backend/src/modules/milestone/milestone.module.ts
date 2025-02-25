import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserModule } from 'src/modules/project-user/project-user.module';
import { Milestone } from './entities/milestone.entity';
import { MilestoneParticipant } from './entities/milestone-participant.entity';
import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone, MilestoneParticipant]),
    ProjectUserModule,
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
