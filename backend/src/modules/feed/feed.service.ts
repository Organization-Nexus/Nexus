import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entites/feed.entity';
import { Repository } from 'typeorm';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import {
  NoPermissionThisFeedException,
  NotFoundFeedException,
} from './exception/feed-exception';
import { CreateCommunityDto } from './dto/create-community.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async createCommunity(
    createCommunityDto: CreateCommunityDto,
    projectUser: ProjectUser,
    communityId: number,
    communityFiles: string[],
    isNotice?: boolean,
  ): Promise<Feed> {
    const feed = this.feedRepository.create({
      ...createCommunityDto,
      community_files: communityFiles,
      community: { id: communityId },
      author: projectUser,
      isNotice,
    });
    return await this.feedRepository.save(feed);
  }

  async validateCommunityOwner(feedId: number, userId: number) {
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
      relations: ['author'],
    });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    if (feed.author.id !== userId) {
      throw new NoPermissionThisFeedException(userId);
    }
    return feed;
  }

  async updateCommunity(
    updateCommunityDto: CreateCommunityDto,
    feedId: number,
    communityFiles: string[],
  ): Promise<Feed> {
    const feed = await this.feedRepository.findOneBy({ id: feedId });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    const updateFields = {
      ...updateCommunityDto,
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
