import { Injectable } from '@nestjs/common';
import { S3ConfigService } from './s3-config.service';
import { ProjectImageDto } from './dto/project-image.dto';
import { ProjectImageInvalidFormatException } from './exception/file-exception';
import { S3UploadFailedException } from './exception/file-exception';

@Injectable()
export class FileService {
  constructor(private readonly s3ConfigService: S3ConfigService) {}

  async handleProjectImageUpload(
    userId: number,
    projectId: number,
    file?: Express.Multer.File,
    predefinedImage?: string,
  ): Promise<string> {
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new ProjectImageInvalidFormatException();
      }
      return await this.projectImageUpload({
        file,
        userId,
        projectId,
      });
    } else if (predefinedImage) {
      return `${predefinedImage}`;
    } else {
      return `${process.env.AWS_COMMON_IMAGE_URL}/grass.png`;
    }
  }

  private async projectImageUpload(
    projectImageDto: ProjectImageDto,
  ): Promise<string> {
    try {
      const uploadParams =
        this.s3ConfigService.projectImageParams(projectImageDto);
      const data = await this.s3ConfigService.uploadToS3(uploadParams);
      return data.Location;
    } catch (error) {
      throw new S3UploadFailedException(error.message);
    }
  }
}
