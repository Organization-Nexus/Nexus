import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteResponse } from '../entities/vote-response.entity';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { VoteOption } from '../entities/vote-options.entity';
import { SingleChoiceOnlyException } from '../exception/vote.exception';

@Injectable()
export class VoteResponseService {
  constructor(
    @InjectRepository(VoteResponse)
    private readonly voteResponseRepository: Repository<VoteResponse>,
  ) {}

  async createVoteResponse(
    vote: Vote,
    projectUser: ProjectUser,
    selectedOptions: VoteOption[],
  ): Promise<VoteResponse[]> {
    if (!vote.isMultipleChoice && selectedOptions.length > 1) {
      throw new SingleChoiceOnlyException();
    }
    const voteResponses = selectedOptions.map((option) =>
      this.voteResponseRepository.create({
        vote,
        option,
        projectUser,
      }),
    );
    return await this.voteResponseRepository.save(voteResponses);
  }
}
