import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ProjectImageDto } from './dto/project-image.dto';
import {
  S3ParamsCreationFailedException,
  S3UploadFailedException,
} from './exception/file-exception';

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

  projectImageParams(
    projectImageDto: ProjectImageDto,
  ): S3.Types.PutObjectRequest {
    const { file, userId, projectId } = projectImageDto;

    try {
      const timestamp = new Date().toISOString();
      const fileKey = `user/${userId}/project/${projectId}/${timestamp}-${file.originalname}`;

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
