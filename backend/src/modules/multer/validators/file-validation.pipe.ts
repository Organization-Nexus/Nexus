import { Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import {
  NoFilesUploadedException,
  FileTooLargeException,
  InvalidFileTypeException,
} from 'src/modules/multer/exception/multer.exception';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new NoFilesUploadedException();
    }

    const sizeLimit = 10 * 1024 * 1024;
    const allowedFileTypes = /\.(jpg|jpeg|png|pdf|docx|pptx)$/i;

    files.forEach((file) => {
      if (file.size > sizeLimit) {
        throw new FileTooLargeException();
      }
      if (!allowedFileTypes.test(file.originalname)) {
        throw new InvalidFileTypeException();
      }
    });

    return files;
  }
}
