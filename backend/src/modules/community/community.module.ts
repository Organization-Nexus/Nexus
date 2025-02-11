import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entites/community.entity';
import { ProjectUserModule } from '../project-user/project-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community]), ProjectUserModule],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
