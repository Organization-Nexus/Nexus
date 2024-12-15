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
    const project = await this.projectService.createProject(createProjectDto);
    let fileUrl: string = null;

    if (file) {
      try {
        fileUrl = await this.fileConfigService.uploadFile(file, project.id);
        await this.projectService.updateProjectImage(project.id, fileUrl);
      } catch (error) {
        return { message: 'Error uploading file to S3', error: error.message };
      }
    } else {
      fileUrl =
        'https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/image/NoImage.jpg';
      await this.projectService.updateProjectImage(project.id, fileUrl);
    }

    return {
      message: 'Project created successfully',
    };
  }
}
