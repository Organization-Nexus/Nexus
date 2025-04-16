import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class NotFoundIssueException extends NotFoundException {
  constructor(issueId: number) {
    super(`Issue with id ${issueId} not found`);
  }
}

export class UnauthorizedIssueException extends UnauthorizedException {
  constructor(userId: number) {
    super(`User ${userId} is not authorized to modify this issue`);
  }
}

export class UnauthorizedIssueWriterException extends UnauthorizedException {
  constructor(userId: number) {
    super(
      ` 마일스톤 참여자만 이슈를 작성할 수 있습니다. 유저 ${userId}는 해당 마일스톤 참여자가 아닙니다.`,
    );
  }
}
