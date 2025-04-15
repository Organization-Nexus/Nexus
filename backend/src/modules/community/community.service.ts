import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from 'src/modules/community/entites/community.entity';
import { GetCommunityContentsDto } from './dto/get-community-contents.dto';

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

  // 👋 단순 존재 여부 확인 -> community.id
  async getCommunityByProjectId(projectId: number): Promise<number> {
    const community = await this.communityRepository.findOneBy({
      id: projectId,
    });
    return community.id;
  }

  async getFeedsOrNoticesByProjectId(
    projectId: number,
    projectUserId: number,
  ): Promise<{
    feeds: GetCommunityContentsDto[];
    notices: GetCommunityContentsDto[];
  }> {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['feeds', 'feeds.author.user.log', 'feeds.likes.projectUser'],
      order: {
        feeds: {
          createdAt: 'DESC',
        },
      },
    });

    const { feeds, notices } = community.feeds.reduce(
      (result, feed) => {
        const transformedFeed: GetCommunityContentsDto = {
          id: feed.id,
          title: feed.title,
          content: feed.content,
          community_files: feed.community_files,
          isNotice: feed.isNotice,
          isImportant: feed.isImportant,
          createdAt: feed.createdAt,
          likeCount: feed.likes.length,
          likedByUser: feed.likes.some((like) => {
            return like.projectUser && like.projectUser.id === projectUserId;
          }),
          author: {
            projectUserId: feed.author.id,
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
        feeds: GetCommunityContentsDto[];
        notices: GetCommunityContentsDto[];
      },
    );
    return {
      feeds,
      notices,
    };
  }

  async getVoteByProjectId(projectId: number, projectUserId: number) {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: [
        'votes',
        'votes.author.user.log',
        'votes.options.response_users.projectUser',
        'votes.likes.projectUser',
      ],
      order: {
        votes: {
          createdAt: 'DESC',
        },
      },
    });

    const votes = community.votes.map((vote) => ({
      id: vote.id,
      title: vote.title,
      content: vote.content,
      isMultipleChoice: vote.isMultipleChoice,
      isAnonymous: vote.isAnonymous,
      createdAt: vote.createdAt,
      deadline: vote.deadline,
      community_files: vote.community_files,
      likeCount: vote.likes.length,
      likedByUser: vote.likes.some((like) => {
        return like.projectUser && like.projectUser.id === projectUserId;
      }),
      author: {
        projectUserId: vote.author.id,
        position: vote.author.position,
        user: {
          name: vote.author.user.name,
          log: {
            status: vote.author.user.log.status,
            profileImage: vote.author.user.log.profileImage,
            rank: vote.author.user.log.rank,
          },
        },
      },
      voteOptions: vote.options
        .map((option) => {
          const voteCount = option.response_users.length;
          const isSelectedByUser = option.response_users.some(
            (response) => response.projectUser.id === projectUserId,
          );
          return {
            id: option.id,
            content: option.content,
            voteCount,
            isSelectedByUser,
          };
        })
        .sort((a, b) => a.id - b.id),
    }));
    return votes;
  }

  async getCommunityOfDashboardByProjectId(projectId: number) {
    const community = await this.communityRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['feeds', 'votes.options'],
    });
    if (!community) return null;
    const latestFeed =
      community.feeds
        .filter((feed) => !feed.isNotice)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0] ||
      null;
    const latestNotice =
      community.feeds
        .filter((feed) => feed.isNotice)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0] ||
      null;
    const latestVote =
      community.votes.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      )[0] || null;
    return {
      feed: latestFeed,
      notice: latestNotice,
      vote: latestVote,
    };
  }
}
