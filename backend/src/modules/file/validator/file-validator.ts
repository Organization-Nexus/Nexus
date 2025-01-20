import { BadRequestException } from '@nestjs/common';

export class FileValidator {
  private static readonly fileTypeMap = new Map([
    ['image/jpg', { category: 'image', maxSize: 5 * 1024 * 1024 }],
    ['image/jpeg', { category: 'image', maxSize: 5 * 1024 * 1024 }],
    ['image/png', { category: 'image', maxSize: 5 * 1024 * 1024 }],
    ['image/gif', { category: 'image', maxSize: 5 * 1024 * 1024 }],
    ['image/webp', { category: 'image', maxSize: 2 * 1024 * 1024 }],
    ['image/svg+xml', { category: 'image', maxSize: 1 * 1024 * 1024 }],
    ['application/pdf', { category: 'docs', maxSize: 10 * 1024 * 1024 }],
    ['application/msword', { category: 'docs', maxSize: 10 * 1024 * 1024 }],
    [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      { category: 'docs', maxSize: 10 * 1024 * 1024 },
    ],
    [
      'application/vnd.ms-excel',
      { category: 'docs', maxSize: 10 * 1024 * 1024 },
    ],
    [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      { category: 'docs', maxSize: 10 * 1024 * 1024 },
    ],
    [
      'application/vnd.ms-powerpoint',
      { category: 'docs', maxSize: 10 * 1024 * 1024 },
    ],
    [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      { category: 'docs', maxSize: 10 * 1024 * 1024 },
    ],
    ['application/x-hwp', { category: 'docs', maxSize: 10 * 1024 * 1024 }],
  ]);

  static validate(file: Express.Multer.File) {
    // MIME 타입 체크
    const fileType = this.fileTypeMap.get(file.mimetype);

    // MIME 타입이 없으면 확장자로 체크
    if (!fileType && file.originalname.endsWith('.hwp')) {
      file.mimetype = 'application/x-hwp'; // MIME 타입을 강제로 지정
    }

    const fileTypeAfterCheck = this.fileTypeMap.get(file.mimetype);

    if (!fileTypeAfterCheck) {
      throw new BadRequestException('Invalid file type.');
    }

    if (file.size > fileTypeAfterCheck.maxSize) {
      throw new BadRequestException(
        `File size exceeds the ${fileTypeAfterCheck.maxSize / 1024 / 1024}MB limit.`,
      );
    }

    return fileTypeAfterCheck;
  }
}
