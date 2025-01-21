import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entites/feed.entity';
import { Repository } from 'typeorm';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { CreateFeedNoticeDto } from './dto/create-feed-notice.dto';
import { Community } from '../community/entites/community.entity';
import {
  NoPermissionThisFeedException,
  NotFoundFeedException,
} from './exception/feed-exception';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async createFeed(
    createFeedNoticeDto: CreateFeedNoticeDto,
    communityFiles: string[],
    communityId: Community,
    projectUser: ProjectUser,
    isNotice?: boolean,
    isImportant?: boolean,
  ): Promise<Feed> {
    const feed = this.feedRepository.create({
      ...createFeedNoticeDto,
      community_files: communityFiles,
      community: communityId,
      author: projectUser,
      isNotice,
      isImportant,
    });
    return await this.feedRepository.save(feed);
  }

  async validateFeedOwner(feedId: number, userId: number) {
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
      relations: ['author'],
    });
    if (feed.author.id !== userId) {
      throw new NoPermissionThisFeedException(userId);
    }
    return feed;
  }

  async updateFeed(
    feedId: number,
    updateFeedDto: CreateFeedNoticeDto,
    communityFiles: string[],
  ): Promise<Feed> {
    const feed = await this.feedRepository.findOneBy({ id: feedId });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    const updateFields = {
      ...updateFeedDto,
      imageUrl: communityFiles || feed.community_files,
    };
    Object.assign(feed, updateFields);
    return await this.feedRepository.save(feed);
  }

  async deleteFeed(feedId: number): Promise<void> {
    const feed = await this.feedRepository.findOneBy({ id: feedId });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    await this.feedRepository.remove(feed);
  }
}
