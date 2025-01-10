import { Controller, Get, Param } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // GET /api/community/feeds/:projectId
  @Get('feeds/:projectId')
  async getFeedsByProjectId(@Param('projectId') projectId: number) {
    console.log('🧑‍🚀 date : ', new Date(Date.now()).toISOString());
    const community =
      await this.communityService.getFeedsByProjectId(projectId);
    return community.feeds;
  }
}
