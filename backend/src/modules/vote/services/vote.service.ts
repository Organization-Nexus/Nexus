import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { VoteNotFoundException } from '../exception/vote.exception';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async createVote(
    createVoteDto: CreateVoteDto,
    communityId: number,
    projectUser: ProjectUser,
    communityFiles: string[],
  ): Promise<Vote> {
    const vote = this.voteRepository.create({
      title: createVoteDto.title,
      content: createVoteDto.content,
      isMultipleChoice: createVoteDto.isMultipleChoice,
      isAnonymous: createVoteDto.isAnonymous,
      deadline: createVoteDto.deadline,
      community: { id: communityId },
      author: projectUser,
      community_files: communityFiles,
    });

    return await this.voteRepository.save(vote);
  }

  async getVoteByVoteId(voteId: number): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
      relations: ['options'],
    });

    if (!vote) {
      throw new VoteNotFoundException(voteId);
    }
    return vote;
  }
}
