import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class ProjectImageInvalidFormatException extends CustomHttpException {
  constructor() {
    super('이미지 파일만 업로드할 수 있습니다. 🥲', HttpStatus.BAD_REQUEST);
  }
}

export class S3UploadFailedException extends CustomHttpException {
  constructor(message: string) {
    super(`S3 업로드 실패: ${message} 🥲`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class S3ParamsCreationFailedException extends CustomHttpException {
  constructor() {
    super('S3 업로드 파라미터 생성 실패 🥲', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
