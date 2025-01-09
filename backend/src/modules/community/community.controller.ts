import { Controller, Get, Param } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('feeds/:projectId')
  async getFeedsByProjectId(@Param('projectId') projectId: number) {
    const community =
      await this.communityService.getFeedsByProjectId(projectId);
    return {
      message: 'Community feeds fetched successfully',
      feeds: community.feeds,
    };
  }
}
