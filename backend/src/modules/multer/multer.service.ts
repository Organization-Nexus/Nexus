import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MulterService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer, fileType: string) {
    const folder = fileType;
    const kstOffset = 9 * 60;
    const timestamp = new Date(new Date().getTime() + kstOffset * 60000)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .replace(/\..+/, '');

    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = `${folder}/${uniqueFileName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'nexus-s3cloud',
        Key: filePath,
        Body: file,
      }),
    );
  }
}
