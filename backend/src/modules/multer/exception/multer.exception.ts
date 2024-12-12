// src/modules/multer/exception/multer.exception.ts
import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

// 파일이 업로드되지 않음
export class NoFilesUploadedException extends CustomHttpException {
  constructor() {
    super('파일이 존재하지 않습니다', HttpStatus.BAD_REQUEST);
  }
}

// 파일 크기가 너무 큼
export class FileTooLargeException extends CustomHttpException {
  constructor() {
    super(
      '파일이 너무 큽니다. 최대 10MB 이하로 업로드 해주세요.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// 잘못된 파일 타입
export class InvalidFileTypeException extends CustomHttpException {
  constructor() {
    super(
      '지원되지 않는 파일 타입입니다. JPG, PNG, PDF, DOCX, PPTX 파일만 업로드 가능합니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
