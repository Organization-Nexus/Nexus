import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/modules/community/entites/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  async createCommunity(projectId: number): Promise<Community> {
    const community = this.communityRepository.create({
      project: { id: projectId },
      createdAt: new Date(),
    });
    return await this.communityRepository.save(community);
  }

  async getCommunityByProjectId(projectId: number): Promise<Community> {
    return await this.communityRepository.findOneBy({
      project: { id: projectId },
    });
  }
}
