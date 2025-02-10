import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteOption } from '../entities/vote-options.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';

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
}
