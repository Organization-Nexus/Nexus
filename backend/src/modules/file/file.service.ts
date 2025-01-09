import { Injectable, BadRequestException } from '@nestjs/common';
import { S3ConfigService } from './s3-config.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { S3UploadFailedException } from './exception/file-exception';
import { S3ConfigDto } from './dto/s3-config.dto';
import { Category } from 'src/types/enum/file-category.enum';
import { FileValidator } from './validator/file-validator';

@Injectable()
export class FileService {
  constructor(private readonly s3ConfigService: S3ConfigService) {}

  async handleFileUpload(uploadFileDto: UploadFileDto): Promise<string> {
    const { file, userId, projectId, category: categoryString } = uploadFileDto;
    const category = Category[categoryString as keyof typeof Category];
    if (!category) {
      throw new BadRequestException('Invalid category');
    }
    const fileTypeInfo = FileValidator.validate(file);
    const fileType = fileTypeInfo.category;

    if (!File) {
      throw new Error('No file uploaded');
    }

    return await this.uploadFileHelper({
      file,
      userId,
      projectId,
      fileType,
      category,
    });
  }

  private async uploadFileHelper(s3ConfigDto: S3ConfigDto): Promise<string> {
    try {
      const uploadParams = this.s3ConfigService.getUploadParams(s3ConfigDto);
      const data = await this.s3ConfigService.uploadToS3(uploadParams);
      return data.Location;
    } catch (error) {
      throw new S3UploadFailedException(error.message);
    }
  }
}
