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
  Patch,
  Delete,
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
import { UpdateProjectDto } from './dto/update-project.dto';

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

    const updatedProject = await this.projectService.updateProjectFile({
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

  // PATCH /api/project/update-project/:projectId
  @Patch('update-project/:projectId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('project_image'))
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    await this.projectUserService.checkAdminPermissions(projectId, userId);
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Invalid file type. Only image files are allowed.',
      );
    }
    await this.projectService.updateProject(projectId, updateProjectDto);
    if (file) {
      const uploadedImages = await this.fileService.handleFileUpload({
        files: [file],
        userId,
        projectId,
        category: Category.PROJECT,
      });
      const finalImage =
        Array.isArray(uploadedImages) && uploadedImages.length > 0
          ? uploadedImages[uploadedImages.length - 1]
          : null;
      if (finalImage) {
        await this.projectService.updateProjectFile({
          projectId,
          project_image: finalImage,
        });
      }
    }
    return {
      message: 'Project updated successfully',
    };
  }

  // DELETE /api/project/delete-project/:projectId
  @Delete('delete-project/:projectId')
  @UseGuards(JwtAuthGuard)
  async deleteProject(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.checkAdminPermissions(projectId, userId);
    return await this.projectService.deleteProject(projectId);
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
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectIds[0],
        userId,
      );
    return this.projectService.getMilestonesByProjectUserIds(
      projectUserId,
      projectIds,
    );
  }

  // GET /api/project/:projectId/issues/my
  @Get(':projectId/issues/my')
  @UseGuards(JwtAuthGuard)
  async getMyIssueList(
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    console.log(userId);
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    console.log(projectUserId);
    return await this.projectService.getMyIssueList(projectUserId);
  }
}
