import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteOption } from '../entities/vote-options.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';
import { InvalidVoteOptionException } from '../exception/vote.exception';

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

  async getVoteOptionsByVoteId(voteId: number, projectUserId: number) {
    const voteOptions = await this.voteOptionRepository.find({
      where: { vote: { id: voteId } },
      relations: ['response_users.projectUser.user.log'],
    });

    return voteOptions
      .map((option) => {
        const voteCount = option.response_users.length;
        const isSelectedByUser = option.response_users.some(
          (response) => response.projectUser.id === projectUserId,
        );
        return {
          id: option.id,
          content: option.content,
          voteCount,
          isSelectedByUser,
          response_users: option.response_users.map((response) => ({
            id: response.projectUser.id,
            name: response.projectUser.user.name,
            profileImage: response.projectUser.user.log.profileImage,
          })),
        };
      })
      .sort((a, b) => a.id - b.id);
  }
}
