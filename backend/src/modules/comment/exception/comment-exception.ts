import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class BothFeedAndVoteProvidedException extends CustomHttpException {
  constructor() {
    super(
      '피드 ID와 투표 ID는 동시에 제공할 수 없습니다. 🥲',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CommentNotFoundException extends CustomHttpException {
  constructor(commentId: number) {
    super(`${commentId}의 댓글을 찾을 수 없습니다. 🥲`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedProjectUserException extends CustomHttpException {
  constructor(commentId: number, projectUserId: number) {
    super(
      `${projectUserId}는 ${commentId}의 댓글에 접근할 권한이 없습니다. 🥲`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ParentCommentNotFoundException extends CustomHttpException {
  constructor(parentCommentId: number) {
    super(
      `Parent comment with ID ${parentCommentId} not found. 🥲`,
      HttpStatus.NOT_FOUND,
    );
  }
}
