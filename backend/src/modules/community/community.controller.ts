import { Controller, Get, Param } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // GET /api/community/feeds/:projectId
  @Get('feeds/:projectId')
  async getFeedsByProjectId(@Param('projectId') projectId: number) {
    return await this.communityService.getFeedsByProjectId(projectId);
  }

  // GET /api/community/notices/:projectId
  @Get('notices/:projectId')
  async getNoticesByProjectId(@Param('projectId') projectId: number) {
    return await this.communityService.getNoticesByProjectId(projectId);
  }
}
