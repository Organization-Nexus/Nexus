// src/validators/file-validation.pipe.ts
import { Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { CustomFile } from './file.interface';
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

    const fileTypeMap = new Map([
      ['image/', 'image'],
      ['application/pdf', 'docs'],
      ['application/msword', 'docs'],
      ['application/vnd.ms-powerpoint', 'docs'],
      ['text/plain', 'docs'],
    ]);

    files.forEach((file) => {
      if (file.size > sizeLimit) {
        throw new FileTooLargeException();
      }
      if (!allowedFileTypes.test(file.originalname)) {
        throw new InvalidFileTypeException();
      }

      const fileType =
        Array.from(fileTypeMap.entries()).find(([key]) =>
          file.mimetype.startsWith(key),
        )?.[1] || 'other';

      (file as CustomFile).fileType = fileType;
    });

    return files;
  }
}
