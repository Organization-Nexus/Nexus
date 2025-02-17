import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async toggleLike(
    likeData: Partial<Like>,
  ): Promise<{ success: boolean; message: string }> {
    const { feed, vote, projectUser } = likeData;
    const existingLike = await this.likeRepository.findOne({
      where: {
        projectUser: { id: projectUser.id },
        ...(feed ? { feed: { id: feed.id } } : {}),
        ...(vote ? { vote: { id: vote.id } } : {}),
      },
      relations: ['feed', 'vote'],
    });
    const userName = projectUser.user?.name || `사용자 ${projectUser.id}`;
    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return {
        success: true,
        message: `${userName}님이 좋아요를 취소했습니다.`,
      };
    }
    const newLike = this.likeRepository.create(likeData);
    await this.likeRepository.save(newLike);
    return { success: true, message: `${userName}님이 좋아요를 추가했습니다.` };
  }

  async getFeedLikes(
    feedId: number,
  ): Promise<{ name: string; profileImage: string | null }[]> {
    const likes = await this.likeRepository.find({
      where: { feed: { id: feedId } },
      relations: ['projectUser', 'projectUser.user.log'],
    });
    return likes.map((like) => ({
      name: like.projectUser.user?.name || '알 수 없는 사용자',
      profileImage: like.projectUser.user?.log.profileImage || null,
    }));
  }
}
