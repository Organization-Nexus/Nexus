import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entites/feed.entity';
import { Repository } from 'typeorm';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Community } from '../community/entites/community.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,

    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,

    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  // async createFeed(
  //   createFeedDto: CreateFeedDto,
  //   projectId: number,
  //   userId: number,
  // ): Promise<Feed> {
  //   // 커뮤니티 조회 (프로젝트 ID로 커뮤니티를 찾음)
  //   const community = await this.communityRepository.findOne({
  //     where: { project: { id: projectId } },
  //   });

  //   if (!community) {
  //     throw new Error('Community not found for the project');
  //   }

  //   // 피드 생성
  //   const feed = this.feedRepository.create({
  //     ...createFeedDto,
  //     community,
  //     author: projectUser,
  //   });

  //   // 피드 저장
  //   return await this.feedRepository.save(feed);
  // }
}
