import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './services/vote.service';
import { VoteOptionService } from './services/vote-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VoteResponse } from './entities/vote-response.entity';
import { VoteOption } from './entities/vote-options.entity';
import { FileModule } from '../file/file.module';
import { ProjectUserModule } from '../project-user/project-user.module';
import { CommunityModule } from '../community/community.module';
import { VoteResponseService } from './services/vote-response.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, VoteOption, VoteResponse]),
    FileModule,
    ProjectUserModule,
    CommunityModule,
  ],
  controllers: [VoteController],
  providers: [VoteService, VoteOptionService, VoteResponseService],
})
export class VoteModule {}
