import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileConfigService } from '../file/file-config.service';
import { InvalidImageFormatException } from './exception/project-exception';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileConfigService: FileConfigService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('project_image'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && !file.mimetype.startsWith('image/')) {
      throw new InvalidImageFormatException();
    }
    const project = await this.projectService.createProject(createProjectDto);
    const fileUrl = file
      ? await this.fileConfigService.projectImageUpload(
          file,
          project.id,
          createProjectDto.userId,
        )
      : 'https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/image/grass.png';
    await this.projectService.updateProjectImage(project.id, fileUrl);
    return {
      message: 'Project created successfully',
      project: await this.projectService.findProjectById(project.id),
    };
  }
}
