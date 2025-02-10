import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MinutesService } from './minutes.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { CreateMinutesDto } from './dto/create-minutes.dto';
import { UserPayload } from 'src/types/user-payload';
import { UpdateMinutesDto } from './dto/update-minutes.dto';

@Controller('projects/:projectId/minutes')
export class MinutesController {
  constructor(
    private readonly minutesService: MinutesService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  // POST /api/projects/:projectId/minutes
  @Post()
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async createMinutes(
    @Body() createMinutesDto: CreateMinutesDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      userId,
    );
    return await this.minutesService.createMinutes(
      createMinutesDto,
      projectUser,
      projectId,
    );
  }

  // GET /api/projects/:projectId/minutes
  @Get()
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async getMinutesList(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );

    return await this.minutesService.getMinutesList(projectId);
  }

  // GET /api/projects/:projectId/minutes/:minutesId
  @Get(':minutesId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async getMinutesDetail(
    @Param('minutesId') minutesId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );

    return await this.minutesService.getMinutesDetail(minutesId);
  }

  // PATCH /api/projects/:projectId/minutes/:minutesId
  @Patch(':minutesId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async updateMinutes(
    @Param('minutesId') minutesId: number,
    @Param('projectId') projectId: number,
    @Body() updateMinutesDto: UpdateMinutesDto,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );

    await this.minutesService.validateMinutesAuthor(minutesId, projectUserId);

    return await this.minutesService.updateMinutes(updateMinutesDto, minutesId);
  }

  // DELETE /api/projects/:projectId/minutes/:minutesId
  @Delete(':minutesId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async deleteMinutes(
    @Param('minutesId') minutesId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );

    await this.minutesService.validateMinutesAuthor(minutesId, projectUserId);
    await this.minutesService.deleteMinutes(minutesId);

    return {
      message: `회의록(${minutesId})이 성공적으로 삭제되었습니다.👋`,
    };
  }
}
