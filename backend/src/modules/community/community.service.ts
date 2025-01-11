import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/modules/community/entites/community.entity';
import { Feed } from '../feed/entites/feed.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  async createCommunity(projectId: number): Promise<Community> {
    const community = this.communityRepository.create({
      project: { id: projectId },
    });
    return await this.communityRepository.save(community);
  }

  async getCommunityByProjectId(projectId: number): Promise<Community> {
    const community = await this.communityRepository.findOneBy({
      id: projectId,
    });
    return community;
  }

  async getFeedsByProjectId(projectId: number): Promise<Feed[]> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['feeds'],
    });
    return community.feeds.filter((feed) => !feed.isNotice);
  }

  async getNoticesByProjectId(projectId: number): Promise<Feed[]> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['feeds'],
    });
    return community.feeds.filter((feed) => feed.isNotice);
  }
}
