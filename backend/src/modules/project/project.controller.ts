import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { FileService } from '../file/file.service';
import {
  InvalidImageFormatException,
  ProjectImageConflictException,
  ProjectImageRequiredException,
} from './exception/project-exception';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ProjectUserService } from '../project-user/project-user.service';
import { ProjectPosition } from '../project-user/entites/project-user.entity';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { UserPayload } from 'src/types/user-payload';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileService: FileService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  private validateFile(
    file?: Express.Multer.File,
    projectImage?: string,
  ): void {
    if (file && projectImage) {
      throw new ProjectImageConflictException();
    }

    if (!file && !projectImage) {
      throw new ProjectImageRequiredException();
    }

    if (file && !file.mimetype.startsWith('image/')) {
      throw new InvalidImageFormatException();
    }
  }

  // 프로젝트 생성
  @Post('create-project')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('project_image'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.validateFile(file, createProjectDto.project_image);
    const userId = req.user.id;
    const project = await this.projectService.createProject(createProjectDto);
    const imageUrl = await this.fileService.handleProjectImageUpload(
      userId,
      project.id,
      file,
      createProjectDto.project_image,
    );

    const updatedProject = await this.projectService.updateProjectImage({
      projectId: project.id,
      imageUrl,
    });

    await this.projectUserService.createProjectUser({
      projectId: project.id,
      userId: userId,
      position: ProjectPosition.PM,
      is_sub_admin: true,
    });

    return {
      message: 'Project created successfully',
      project: updatedProject,
    };
  }

  // 내 프로젝트 목록 조회
  @Get('my-projects')
  // @UseGuards(JwtAuthGuard)
  async getMyProjects() {
    const userId = 4;
    return await this.projectService.getMyProjects(userId);
  }

  // 프로젝트 상세 조회
  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async getProjectDetail(
    @Param('id') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMember(projectId, userId);
    return await this.projectService.getProjectDetail(projectId);
  }

  // 프로젝트 상세 조회한다고하자 파라미터는 project id 와 user id 를 받는다.
  // projectId는 프로젝트의 id를 나타낸다.
  // userId를 받는 이유는 project-user가 해당 프로젝트에 속해있는지 확인하고 속해있으면 project와 project-user를 반환한다.
}
