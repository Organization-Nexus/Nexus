import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custum.http.exception';

export class VoteNotFoundException extends CustomHttpException {
  constructor(voteId: number) {
    super(`${voteId}번의 투표가 없습니다. 🥲`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidVoteOptionException extends CustomHttpException {
  constructor() {
    super('유효하지 않은 선택지입니다. 😅', HttpStatus.BAD_REQUEST);
  }
}

export class AnonymousVoteException extends CustomHttpException {
  constructor() {
    super(
      '익명투표이므로 투표한 사람을 볼 수 없습니다. 😂',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class SingleChoiceOnlyException extends CustomHttpException {
  constructor() {
    super('이 투표는 단일 선택만 가능합니다. 😅', HttpStatus.BAD_REQUEST);
  }
}
