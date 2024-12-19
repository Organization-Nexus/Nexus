import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class ProjectNotFoundException extends CustomHttpException {
  constructor(projectId: string) {
    super(
      `ID가 ${projectId}인 프로젝트를 찾을 수 없습니다.`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidImageFormatException extends CustomHttpException {
  constructor() {
    super('이미지 파일만 업로드할 수 있습니다.', HttpStatus.BAD_REQUEST);
  }
}
