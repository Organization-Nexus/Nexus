import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteResponse } from '../entities/vote-response.entity';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { VoteOption } from '../entities/vote-options.entity';

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
    const newVoteResponses = selectedOptions.map((option) =>
      this.voteResponseRepository.create({
        vote,
        option,
        projectUser,
      }),
    );
    await this.voteResponseRepository.save(newVoteResponses);
    return newVoteResponses;
  }

  async handleExistingVoteResponse(
    voteId: number,
    projectUser: ProjectUser,
  ): Promise<void> {
    const existingVoteResponses = await this.voteResponseRepository.find({
      where: { vote: { id: voteId }, projectUser: { id: projectUser.id } },
      relations: ['option'],
    });
    if (existingVoteResponses.length > 0) {
      await this.voteResponseRepository.remove(existingVoteResponses);
    }
  }
}
