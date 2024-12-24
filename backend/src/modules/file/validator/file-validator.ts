import { BadRequestException } from '@nestjs/common';

export class FileValidator {
  private static readonly fileTypeMap = new Map([
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
  ]);

  static validate(file: Express.Multer.File) {
    const fileType = this.fileTypeMap.get(file.mimetype);

    if (!fileType) {
      throw new BadRequestException('Invalid file type.');
    }

    if (file.size > fileType.maxSize) {
      throw new BadRequestException(
        `File size exceeds the ${fileType.maxSize / 1024 / 1024}MB limit.`,
      );
    }

    return fileType;
  }
}
