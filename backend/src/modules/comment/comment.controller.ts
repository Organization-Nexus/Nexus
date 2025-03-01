import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserPayload } from 'src/types/user-payload';
import { ProjectUserService } from '../project-user/project-user.service';
import { FeedService } from '../feed/feed.service';
import { VoteService } from '../vote/services/vote.service';
import { ReadCommentDto } from './dto/read-comment.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly projectUserService: ProjectUserService,
    private readonly feedService: FeedService,
    private readonly voteService: VoteService,
  ) {}

  // POST /api/comment/feed/:projectId
  @Post('/feed/:projectId')
  @UseGuards(JwtAuthGuard)
  async createFeedComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ): Promise<Comment> {
    const { content, parentCommentId } = createCommentDto;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      req.user.id,
    );
    const feed = await this.feedService.validateFeed(createCommentDto.feedId);
    return await this.commentService.createFeedComment(
      feed,
      content,
      projectUser,
      parentCommentId,
    );
  }

  // POST /api/comment/vote/:projectId
  @Post('/vote/:projectId')
  @UseGuards(JwtAuthGuard)
  async createVoteComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ): Promise<number> {
    const { content, parentCommentId } = createCommentDto;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      req.user.id,
    );
    const vote = await this.voteService.validateVote(createCommentDto.voteId);
    return await this.commentService.createVoteComment(
      vote,
      content,
      projectUser,
      parentCommentId,
    );
  }

  // GET /api/comment/feed/:feedId
  @Get('/feed/:feedId')
  async findByFeed(@Param('feedId') feedId: number): Promise<ReadCommentDto[]> {
    return this.commentService.findByFeedOrVote(feedId, undefined);
  }

  // GET /api/comment/vote/:voteId
  @Get('/vote/:voteId')
  async findByVote(@Param('voteId') voteId: number): Promise<ReadCommentDto[]> {
    return this.commentService.findByFeedOrVote(undefined, voteId);
  }

  // DELETE /api/comment/:commentId/:projectId
  @Delete('/:commentId/:projectId')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('commentId') commentId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ): Promise<{ message: string }> {
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        req.user.id,
      );
    await this.commentService.delete(commentId, projectUserId);
    return {
      message: `Comment with ID ${commentId} has been successfully deleted.👋`,
    };
  }
}
