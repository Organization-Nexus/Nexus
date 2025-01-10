import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entites/feed.entity';
import { Repository } from 'typeorm';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Community } from '../community/entites/community.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async createFeed(
    createFeedDto: CreateFeedDto,
    feedImageUrl: string,
    communityId: Community,
    projectUser: ProjectUser,
  ): Promise<Feed> {
    const feed = this.feedRepository.create({
      ...createFeedDto,
      feed_file: feedImageUrl,
      community: communityId,
      author: projectUser,
    });

    console.log(feed);

    return await this.feedRepository.save(feed);
  }
}
