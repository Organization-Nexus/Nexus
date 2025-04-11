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
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { UserPayload } from 'src/types/user-payload';
import { Category } from 'src/types/enum/file-category.enum';
import { FileService } from '../file/file.service';
import { ProjectUserService } from '../project-user/project-user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectUserService: ProjectUserService,
    private readonly fileService: FileService,
  ) {}

  // POST /api/project/create-project
  @Post('create-project')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('project_image'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Invalid file type. Only image files are allowed.',
      );
    }
    const project = await this.projectService.createProject(
      createProjectDto,
      userId,
    );
    const projectImage = file
      ? await this.fileService.handleFileUpload({
          files: [file],
          userId,
          projectId: project.id,
          category: Category.PROJECT,
        })
      : createProjectDto.project_image || null;
    const finalProjectImage = Array.isArray(projectImage)
      ? projectImage[0]
      : projectImage;

    const updatedProject = await this.projectService.updateProject({
      projectId: project.id,
      project_image: finalProjectImage,
    });

    return {
      message: 'Project created successfully',
      project: updatedProject,
    };
  }

  // GET /api/project/my-projects
  @Get('my-projects')
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@Req() req: UserPayload) {
    const userId = req.user.id;
    return await this.projectService.getMyProjects(userId);
  }

  // GET /api/detail/:projectId
  @Get('detail/:projectId')
  @UseGuards(JwtAuthGuard)
  async getProjectDetail(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.projectService.getProject(projectId);
  }

  // GET /api/project/milestones/:projectIds
  @Get('milestones/:projectIds')
  @UseGuards(JwtAuthGuard)
  async getMilestonesByProjectIds(
    @Param('projectIds') projectIdsParam: string,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectIds = projectIdsParam
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
    const projectUserIds = await Promise.all(
      projectIds.map(async (projectId) => {
        try {
          return await this.projectUserService.validateProjectMemberByUserId(
            projectId,
            userId,
          );
        } catch {
          return null;
        }
      }),
    );
    const validProjectUserIds = projectUserIds.filter(
      (id): id is number => id !== null,
    );
    return this.projectService.getMilestonesByProjectUserIds(
      validProjectUserIds,
      projectIds,
    );
  }
}
