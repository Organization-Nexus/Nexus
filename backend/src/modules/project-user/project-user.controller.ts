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
import { UserService } from '../user/user.service';
import { UserPayload } from 'src/types/user-payload';
import { ProjectUserDto } from './dto/project-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('project-user')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly userService: UserService,
  ) {}

  // POST /api/project-user/invite/:projectId
  @Post('invite/:projectId')
  @UseGuards(JwtAuthGuard)
  async inviteUserToProject(
    @Body() projectUserDto: Omit<ProjectUserDto, 'projectId' | 'userId'>,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const organizerId = req.user.id;
    await this.projectUserService.checkAdminPermissions(projectId, organizerId);
    const invitedUser = await this.userService.findByEmail(
      projectUserDto.email,
    );
    await this.projectUserService.validateIsUserAleadyMember(
      projectId,
      invitedUser.id,
    );
    const newProjectUser = await this.projectUserService.createProjectUser({
      ...projectUserDto,
      projectId,
      userId: invitedUser.id,
    });

    return {
      message: `User with ID ${invitedUser.id} has been successfully invited to project with ID ${projectId}. 🎉`,
      projectUser: newProjectUser,
    };
  }

  // GET /api/project-user/get-project-users/:projectId
  @Get('get-project-users/:projectId')
  @UseGuards(JwtAuthGuard)
  async getProjectUsers(@Param('projectId') projectId: number) {
    return await this.projectUserService.getProjectUsers(projectId);
  }

  // GET /api/project-user/get-project-user/:projectId
  @Get('get-project-user/:projectId')
  @UseGuards(JwtAuthGuard)
  async getProjectUser(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    return await this.projectUserService.getProjectUser(projectId, req.user.id);
  }
}
