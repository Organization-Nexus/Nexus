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
import { UpdateCommunityDto } from './dto/update-community-dto';

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

  async getFeedByFeedId(feedId: number): Promise<Feed> {
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
      // relations: ['author', 'author.user', 'author.user.log'],
    });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    return feed;
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
    updateCommunityDto: UpdateCommunityDto,
    feedId: number,
    finalFiles: string[],
  ): Promise<Feed> {
    const MAX_FILES = 10;
    const feed = await this.feedRepository.findOneBy({ id: feedId });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    const existingFiles = feed.community_files || [];
    const newTotalFiles = existingFiles.length + finalFiles.length;
    if (newTotalFiles > MAX_FILES) {
      throw new Error('첨부 파일은 10개 이내로 업로드할 수 있어요.');
    }
    feed.community_files = finalFiles;
    Object.assign(feed, updateCommunityDto);
    return await this.feedRepository.save(feed);
  }

  async getCommunityFiles(feedId: number): Promise<string[]> {
    const feed = await this.feedRepository.findOne({ where: { id: feedId } });
    return feed.community_files || [];
  }

  async deleteFeed(feedId: number): Promise<void> {
    const feed = await this.feedRepository.findOneBy({ id: feedId });
    if (!feed) {
      throw new NotFoundFeedException(feedId);
    }
    await this.feedRepository.remove(feed);
  }
}
