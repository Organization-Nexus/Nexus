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
import { MilestoneService } from './milestone.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UserPayload } from 'src/types/user-payload';
import { UpdateMilestoneDto } from './dto/update-milestone';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('projects/:projectId/milestones')
export class MilestoneController {
  constructor(
    private readonly milestoneService: MilestoneService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  // POST /api/projects/:projectId/milestones
  @Post()
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async createMilestone(
    @Body() createMilestoneDto: CreateMilestoneDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      userId,
    );
    console.log('projectUser:', projectUser);
    return await this.milestoneService.createMilestone(
      createMilestoneDto,
      projectUser,
      projectId,
    );
  }

  // GET /api/projects/:projectId/milestones
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMilestoneList(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.milestoneService.getMilestoneList(projectId);
  }

  // GET /api/projects/:projectId/milestones/:milestoneId
  @Get(':milestoneId')
  @UseGuards(JwtAuthGuard)
  async getMilestoneDetail(
    @Param('milestoneId') milestoneId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.milestoneService.getMilestoneDetail(milestoneId);
  }

  // PATCH /api/projects/:projectId/milestones/:milestoneId
  @Patch(':milestoneId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async updateMilestone(
    @Param('milestoneId') milestoneId: number,
    @Param('projectId') projectId: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );

    await this.milestoneService.validateMilestoneAuthor(
      milestoneId,
      projectUserId,
    );
    return await this.milestoneService.updateMilestone(
      updateMilestoneDto,
      milestoneId,
    );
  }

  // DELETE /api/projects/:projectId/milestones/:milestoneId
  @Delete(':milestoneId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async deleteMilestone(
    @Param('milestoneId') milestoneId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );

    await this.milestoneService.validateMilestoneAuthor(
      milestoneId,
      projectUserId,
    );
    await this.milestoneService.deleteMilestone(milestoneId);

    return {
      message: `마일스톤(${milestoneId})이 성공적으로 삭제되었습니다.`,
    };
  }
}
