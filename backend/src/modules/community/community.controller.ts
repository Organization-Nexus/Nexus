import { Controller, Get, Param } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // GET /api/community/feeds/:projectId
  @Get('feeds/:projectId')
  async getFeedsByProjectId(@Param('projectId') projectId: number) {
    const { feeds } =
      await this.communityService.getFeedsOrNoticesByProjectId(projectId);
    return feeds;
  }

  // GET /api/community/notices/:projectId
  @Get('notices/:projectId')
  async getNoticesByProjectId(@Param('projectId') projectId: number) {
    const { notices } =
      await this.communityService.getFeedsOrNoticesByProjectId(projectId);
    return notices;
  }

  // GET /api/community/vote/:projectId
  @Get('votes/:projectId')
  async getVoteByProjectId(@Param('projectId') projectId: number) {
    return await this.communityService.getVoteByProjectId(projectId);
  }
}
