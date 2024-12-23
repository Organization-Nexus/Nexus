import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
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

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileService: FileService,
  ) {}

  // 프로젝트 생성
  @Post('create-project')
  @UseInterceptors(FileInterceptor('project_image'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file && createProjectDto.project_image) {
      throw new ProjectImageConflictException();
    }
    if (!file && !createProjectDto.project_image) {
      throw new ProjectImageRequiredException();
    }
    if (file && !file.mimetype.startsWith('image/')) {
      throw new InvalidImageFormatException();
    }
    const project = await this.projectService.createProject(createProjectDto);
    const imageUrl = await this.fileService.handleProjectImageUpload(
      file,
      createProjectDto.project_image,
      project.userId,
      project.id,
    );

    const updatedProject = await this.projectService.updateProjectImage(
      project.id,
      imageUrl,
    );

    return {
      message: 'Project created successfully',
      project: updatedProject,
    };
  }
}
