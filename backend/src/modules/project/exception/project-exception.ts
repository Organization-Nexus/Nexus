import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class ProjectNotFoundException extends CustomHttpException {
  constructor(projectId: number) {
    super(
      `ID가 ${projectId}인 프로젝트를 찾을 수 없습니다. 🥲`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidImageFormatException extends CustomHttpException {
  constructor() {
    super('이미지 파일만 업로드할 수 있습니다. 🥲', HttpStatus.BAD_REQUEST);
  }
}

export class ProjectImageConflictException extends CustomHttpException {
  constructor() {
    super(
      '프로젝트 이미지는 하나만 제공할 수 있습니다. 🥲',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ProjectImageRequiredException extends CustomHttpException {
  constructor() {
    super('프로젝트 이미지를 제공해야 합니다. 🥲', HttpStatus.BAD_REQUEST);
  }
}
