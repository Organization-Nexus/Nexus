import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class NotFoundMilestoneException extends NotFoundException {
  constructor(milestoneId: number) {
    super(`마일스톤 ID(${milestoneId})를 찾을 수 없습니다.`);
  }
}

export class UnauthorizedMilestoneException extends UnauthorizedException {
  constructor(userId: number) {
    super(`사용자(${userId})는 이 마일스톤을 수정할 권한이 없습니다.`);
  }
}
