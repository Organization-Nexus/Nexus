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

  async getFeedsOrNoticesByProjectId(
    projectId: number,
  ): Promise<{ feeds: GetFeedNoticeDto[]; notices: GetFeedNoticeDto[] }> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: [
        'feeds',
        'feeds.author',
        'feeds.author.user',
        'feeds.author.user.log',
      ],
    });
    const { feeds, notices } = community.feeds.reduce(
      (result, feed) => {
        const transformedFeed: GetFeedNoticeDto = {
          id: feed.id,
          title: feed.title,
          content: feed.content,
          feed_files: feed.feed_files,
          isNotice: feed.isNotice,
          isImportant: feed.isImportant,
          createdAt: feed.createdAt,
          author: {
            position: feed.author.position,
            user: {
              name: feed.author.user.name,
              log: {
                status: feed.author.user.log.status,
                profileImage: feed.author.user.log.profileImage,
                rank: feed.author.user.log.rank,
              },
            },
          },
        };

        if (feed.isNotice) {
          result.notices.push(transformedFeed);
        } else {
          result.feeds.push(transformedFeed);
        }
        return result;
      },
      { feeds: [], notices: [] } as {
        feeds: GetFeedNoticeDto[];
        notices: GetFeedNoticeDto[];
      },
    );

    feeds.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { feeds, notices };
  }
}
