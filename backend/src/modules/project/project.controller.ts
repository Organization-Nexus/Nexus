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
import { Category } from 'src/types/enum/file-category.enum';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileService: FileService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  @Post('create-project')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('project_image'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;

    // 프로젝트 생성
    const project = await this.projectService.createProject({
      ...createProjectDto,
      project_image: null,
    });

    // 파일 또는 문자열 이미지 처리
    let projectImageUrl: string | null = null;
    if (file) {
      projectImageUrl = await this.fileService.handleFileUpload({
        file,
        userId,
        projectId: project.id,
        category: Category.PROJECT,
      });
    } else if (
      createProjectDto.project_image &&
      typeof createProjectDto.project_image === 'string'
    ) {
      projectImageUrl = createProjectDto.project_image;
    }

    // 이미지 업데이트 적용
    const updatedProject = await this.projectService.updateProjectImage({
      projectId: project.id,
      project_image: projectImageUrl,
    });

    await this.projectUserService.createProjectUser({
      projectId: updatedProject.id,
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
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@Req() req: UserPayload) {
    const userId = req.user.id;
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
