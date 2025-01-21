import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserPayload } from 'src/types/user-payload';
import { UserService } from '../user/user.service';
import { CreatePronectUserDto } from './dto/create-project-user.dto';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('project-user')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly userService: UserService,
  ) {}

  // POST /api/project-user/invite/:projectId
  @Post('invite/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async inviteUserToProject(
    @Body() createProjectUserDto: CreatePronectUserDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const organizerId = req.user.id;
    const projectUser =
      await this.projectUserService.validateProjectMemberByUserId(
        organizerId,
        projectId,
      );
    if (!projectUser.is_sub_admin) {
      throw new Error('권한이 없습니다.');
    }
    await this.projectUserService.validateProjectMemberByEmail(
      projectId,
      createProjectUserDto.email,
    );
    let invitedUser = await this.userService.findByEmail(
      createProjectUserDto.email,
    );
    const newProjectUser = await this.projectUserService.createProjectUser({
      projectId,
      userId: invitedUser.id,
      position: createProjectUserDto.position,
      is_sub_admin: createProjectUserDto.is_sub_admin,
    });

    return {
      message: `User with ID ${invitedUser.id} has been successfully invited to project with ID ${projectId}.`,
      projectUser: newProjectUser,
    };
  }

  // GET /api/project-user/get-project-users/:projectId
  @Get('get-project-users/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async getProjectUsers(@Param('projectId') projectId: number) {
    return await this.projectUserService.getProjectUsers(projectId);
  }
}
