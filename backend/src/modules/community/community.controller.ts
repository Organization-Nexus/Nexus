import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserPayload } from 'src/types/user-payload';
import { ProjectUserService } from '../project-user/project-user.service';

@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly projectUserService: ProjectUserService,
  ) {}

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
  @UseGuards(JwtAuthGuard)
  async getVoteByProjectId(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      req.user.id,
    );
    return await this.communityService.getVoteByProjectId(
      projectId,
      projectUser.id,
    );
  }
}
