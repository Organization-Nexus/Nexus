// src/multer/multer.controller.ts
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
import { CustomFile } from './validators/file.interface';

@Controller('multer')
export class MulterController {
  constructor(private readonly multerService: MulterService) {}

  @Post('upload')
  @UseGuards(ThrottlerBehindProxyGuard)
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadFiles(
    @UploadedFiles(new FileValidationPipe()) files: CustomFile[],
  ) {
    for (const file of files) {
      await this.multerService.upload(
        file.originalname,
        file.buffer,
        file.fileType,
      );
    }

    return { message: 'Files uploaded successfully' };
  }
}
