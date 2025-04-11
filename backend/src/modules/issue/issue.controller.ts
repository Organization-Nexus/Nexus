import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserPayload } from 'src/types/user-payload';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('projects/:projectId/milestones/:milestoneId/issues')
export class IssueController {
  constructor(
    private readonly issueService: IssueService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  // POST /api/projects/:projectId/milestones/:milestoneId/issues
  @Post()
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async createIssue(
    @Body() createIssueDto: CreateIssueDto,
    @Param('projectId') projectId: number,
    @Param('milestoneId') milestoneId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      userId,
    );
    return await this.issueService.createIssue(
      createIssueDto,
      projectUser,
      milestoneId,
    );
  }

  // GET /api/projects/:projectId/milestones/:milestoneId/issues
  @Get()
  @UseGuards(JwtAuthGuard)
  async getIssueList(
    @Param('projectId') projectId: number,
    @Param('milestoneId') milestoneId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.issueService.getIssueList(milestoneId);
  }

  // GET /api/projects/:projectId/milestones/:milestoneId/issues/:issueId
  @Get(':issueId')
  @UseGuards(JwtAuthGuard)
  async getIssueDetail(
    @Param('issueId') issueId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.issueService.getIssueDetail(issueId);
  }

  // PATCH /api/projects/:projectId/milestones/:milestoneId/issues/:issueId
  @Patch(':issueId')
  @UseGuards(JwtAuthGuard)
  async updateIssue(
    @Param('issueId') issueId: number,
    @Param('projectId') projectId: number,
    @Body() updateIssueDto: UpdateIssueDto,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    await this.issueService.validateIssueAuthor(issueId, projectUserId);
    return await this.issueService.updateIssue(updateIssueDto, issueId);
  }

  // DELETE /api/projects/:projectId/milestones/:milestoneId/issues/:issueId
  @Delete(':issueId')
  @UseGuards(JwtAuthGuard)
  async deleteIssue(
    @Param('issueId') issueId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    await this.issueService.validateIssueAuthor(issueId, projectUserId);
    await this.issueService.deleteIssue(issueId);

    return {
      message: `이슈(${issueId})가 성공적으로 삭제되었습니다.`,
    };
  }
}
