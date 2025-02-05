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
  async handleFileUpload(uploadFileDto: UploadFileDto): Promise<string[]> {
    const {
      files,
      userId,
      projectId,
      category: categoryString,
    } = uploadFileDto;
    const category = Category[categoryString as keyof typeof Category];
    if (!category) {
      throw new BadRequestException('Invalid category');
    }
    if (files.length > 10) {
      throw new BadRequestException(
        '첨부 파일은 10개 이내로 업로드할 수 있습니다.',
      );
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const fileLocations: string[] = [];

    for (const file of files) {
      const fileTypeInfo = FileValidator.validate(file);
      const fileType = fileTypeInfo.category;
      const fileLocation = await this.uploadFileHelper({
        file,
        userId,
        projectId,
        fileType,
        category,
      });
      fileLocations.push(fileLocation);
    }

    return fileLocations;
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
