import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/modules/community/entites/community.entity';
import { Feed } from '../feed/entites/feed.entity';
import { GetFeedNoticeDto } from './dto/get-feed-notice.dto';

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

  async getFeedsByProjectId(projectId: number): Promise<GetFeedNoticeDto[]> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: [
        'feeds',
        'feeds.author',
        'feeds.author.user',
        'feeds.author.user.log',
      ],
    });

    return community.feeds
      .filter((feed) => !feed.isNotice)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map(
        ({ id, title, content, feed_files, isNotice, createdAt, author }) => ({
          id,
          title,
          content,
          feed_files,
          isNotice,
          createdAt,
          author: {
            position: author.position,
            user: {
              name: author.user.name,
              log: {
                status: author.user.log.status,
                profileImage: author.user.log.profileImage,
                rank: author.user.log.rank,
              },
            },
          },
        }),
      );
  }

  async getNoticesByProjectId(projectId: number): Promise<Feed[]> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['feeds', 'feeds.author', 'feeds.author.user'],
    });
    return community.feeds.filter((feed) => feed.isNotice);
  }
}
