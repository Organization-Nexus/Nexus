import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MulterService } from './multer.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { FileValidationPipe } from './validators/file-validation.pipe';

@Controller('multer')
export class MulterController {
  constructor(private readonly multerService: MulterService) {}

  @Post('upload')
  @UseGuards(ThrottlerBehindProxyGuard)
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadFiles(
    @UploadedFiles(new FileValidationPipe()) files: Express.Multer.File[],
  ) {
    const fileTypeMap = new Map([
      ['image/', 'image'],
      ['application/pdf', 'docs'],
      ['application/msword', 'docs'],
      ['application/vnd.ms-powerpoint', 'docs'],
      ['text/plain', 'docs'],
    ]);
    for (const file of files) {
      const fileType =
        Array.from(fileTypeMap.entries()).find(([key]) =>
          file.mimetype.startsWith(key),
        )?.[1] || 'other';

      await this.multerService.upload(file.originalname, file.buffer, fileType);
    }

    return { message: 'Files uploaded successfully' };
  }
}
