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
