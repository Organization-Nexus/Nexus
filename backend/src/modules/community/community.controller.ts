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
  @UseGuards(JwtAuthGuard)
  async getFeedsByProjectId(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        req.user.id,
      );
    const { feeds } = await this.communityService.getFeedsOrNoticesByProjectId(
      projectId,
      projectUserId,
    );
    return feeds;
  }

  // GET /api/community/notices/:projectId
  @Get('notices/:projectId')
  @UseGuards(JwtAuthGuard)
  async getNoticesByProjectId(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        req.user.id,
      );
    const { notices } =
      await this.communityService.getFeedsOrNoticesByProjectId(
        projectId,
        projectUserId,
      );
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

  // GET /api/community/dashboard/:projectId
  @Get('dashboard/:projectId')
  @UseGuards(JwtAuthGuard)
  async getDashboardByProjectId(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      req.user.id,
    );
    return await this.communityService.getCommunityOfDashboardByProjectId(
      projectId,
    );
  }
}
