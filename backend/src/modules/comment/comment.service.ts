import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Feed } from 'src/modules/feed/entites/feed.entity';
import { Vote } from '../vote/entities/vote.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import {
  CommentNotFoundException,
  UnauthorizedProjectUserException,
} from './exception/comment-exception';
import { ReadCommentDto } from './dto/read-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createFeedComment(
    feed: Feed,
    content: string,
    projectUser: ProjectUser,
    parentCommentId?: number,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = content;
    comment.feed = feed;
    comment.projectUser = projectUser;
    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      comment.parentComment = parentComment;
    }
    return this.commentRepository.save(comment);
  }

  async createVoteComment(
    vote: Vote,
    content: string,
    projectUser: ProjectUser,
    parentCommentId?: number,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = content;
    comment.vote = vote;
    comment.projectUser = projectUser;
    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      comment.parentComment = parentComment;
    }
    return this.commentRepository.save(comment);
  }

  async findById(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async findByFeedOrVote(
    feedId?: number,
    voteId?: number,
  ): Promise<ReadCommentDto[]> {
    const whereCondition: any = { parentComment: null };
    if (feedId) {
      whereCondition.feed = { id: feedId };
    } else if (voteId) {
      whereCondition.vote = { id: voteId };
    }
    const comments = await this.commentRepository.find({
      where: whereCondition,
      relations: ['projectUser.user.log', 'replies.projectUser.user.log'],
      order: {
        createdAt: 'ASC',
        replies: {
          createdAt: 'ASC',
        },
      },
    });
    const replyIds = new Set<number>();
    comments.forEach((comment) =>
      comment.replies.forEach((reply) => replyIds.add(reply.id)),
    );
    return comments
      .filter((comment) => !replyIds.has(comment.id))
      .map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        projectUser: {
          id: comment.projectUser.id,
          position: comment.projectUser.position,
          name: comment.projectUser.user.name,
          profileImage: comment.projectUser.user.log.profileImage,
        },
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          projectUser: {
            id: reply.projectUser.id,
            position: reply.projectUser.position,
            name: reply.projectUser.user.name,
            profileImage: reply.projectUser.user.log.profileImage,
          },
        })),
      }));
  }

  async delete(commentId: number, projectUserId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['projectUser'],
    });
    if (!comment) {
      throw new CommentNotFoundException(commentId);
    }
    if (comment.projectUser.id !== projectUserId) {
      throw new UnauthorizedProjectUserException(commentId, projectUserId);
    }
    await this.commentRepository.delete(commentId);
  }
}
