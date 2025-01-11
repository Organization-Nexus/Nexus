import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import {
  S3ParamsCreationFailedException,
  S3UploadFailedException,
} from './exception/file-exception';
import { S3ConfigDto } from './dto/s3-config.dto';
import { Category } from 'src/types/enum/file-category.enum';

@Injectable()
export class S3ConfigService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  private generateFileKey(
    userId: number,
    projectId: number | undefined,
    fileType: string | undefined,
    category: Category,
    file: Express.Multer.File,
  ): string {
    const timestamp = new Date().toISOString();
    const baseKey = `user/${userId}`;

    switch (category) {
      case Category.AVATAR:
        return `${baseKey}/${timestamp}-${file.originalname}`;

      case Category.MESSAGE:
        if (!fileType)
          throw new Error('FileType is required for MESSAGE category.');
        return `${baseKey}/message/${fileType}/${timestamp}-${file.originalname}`;

      case Category.PROJECT:
        if (!projectId)
          throw new Error('ProjectId is required for PROJECT category.');
        return `${baseKey}/project/${projectId}/${timestamp}-${file.originalname}`;

      case Category.COMMUNITY:
        if (!projectId)
          throw new Error('ProjectId is required for COMMUNITY category.');
        return `${baseKey}/project/${projectId}/community/${fileType}/${timestamp}-${file.originalname}`;

      default:
        throw new Error('Invalid category.');
    }
  }

  getUploadParams(s3ConfigDto: S3ConfigDto): S3.Types.PutObjectRequest {
    const { file, userId, projectId, fileType, category } = s3ConfigDto;
    try {
      if (!category) {
        throw new Error('Category is required.');
      }
      const fileKey = this.generateFileKey(
        userId,
        projectId,
        fileType,
        category,
        file,
      );
      return {
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
    } catch (error) {
      throw new S3ParamsCreationFailedException();
    }
  }

  async uploadToS3(
    uploadParams: S3.Types.PutObjectRequest,
  ): Promise<S3.ManagedUpload.SendData> {
    try {
      return await this.s3.upload(uploadParams).promise();
    } catch (error) {
      throw new S3UploadFailedException(error.message);
    }
  }
}
