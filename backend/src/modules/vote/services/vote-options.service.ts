import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteOption } from '../entities/vote-options.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';
import {
  AnonymousVoteException,
  InvalidVoteOptionException,
  VoteNotFoundException,
} from '../exception/vote.exception';

@Injectable()
export class VoteOptionService {
  constructor(
    @InjectRepository(VoteOption)
    private readonly voteOptionRepository: Repository<VoteOption>,
  ) {}

  async createVoteOptions(
    options: string[],
    vote: Vote,
  ): Promise<{ id: number; content: string; vote_id: number }[]> {
    const voteOptions = options.map((content) =>
      this.voteOptionRepository.create({ content, vote }),
    );
    const savedOptions = await this.voteOptionRepository.save(voteOptions);

    return savedOptions.map((option) => ({
      id: option.id,
      content: option.content,
      vote_id: option.vote.id,
    }));
  }

  async validateVoteOptions(voteId: number, voteOptionIds: number[]) {
    const validOptions = await Promise.all(
      voteOptionIds.map((optionId) =>
        this.validateVoteOption(voteId, optionId),
      ),
    );
    return validOptions;
  }

  private async validateVoteOption(
    voteId: number,
    voteOptionId: number,
  ): Promise<VoteOption> {
    const voteOption = await this.voteOptionRepository.findOne({
      where: { vote: { id: voteId }, id: voteOptionId },
    });
    if (!voteOption) {
      throw new InvalidVoteOptionException();
    }
    return voteOption;
  }

  async getVoteOptionDetails(voteOptionsId: number) {
    const voteOption = await this.voteOptionRepository.findOne({
      where: { id: voteOptionsId },
      relations: ['vote', 'response_users.projectUser.user.log'],
    });
    if (!voteOption) {
      throw new VoteNotFoundException(voteOptionsId);
    }
    if (voteOption.vote.isAnonymous) {
      throw new AnonymousVoteException();
    }

    const responseUsers = voteOption.response_users.map((response) => ({
      userId: response.projectUser.id,
      userName: response.projectUser.user.name,
      profileImage: response.projectUser.user.log.profileImage,
    }));

    return {
      voteOptionId: voteOption.id,
      responseUsers: responseUsers,
      voteCount: voteOption.response_users.length,
    };
  }
}
