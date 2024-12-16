import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FileValidator } from './validator/file-validator';

@Injectable()
export class FileConfigService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async projectImageUpload(
    file: Express.Multer.File,
    projectId: string,
    userId: string,
  ): Promise<string> {
    FileValidator.validate(file);
    try {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files are allowed.');
      }
      const uploadParams = {
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: `user/${userId}/project/${projectId}/${new Date(
          Date.now() + 9 * 60 * 60 * 1000,
        )
          .toLocaleString('ko-KR', { hour12: false })
          .replace(/[^0-9]/g, '')}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const data = await this.s3.upload(uploadParams).promise();
      return data.Location;
    } catch (error) {
      throw new Error('Error uploading file to S3: ' + error.message);
    }
  }
}
