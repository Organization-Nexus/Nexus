import { Controller, Put, Param, UseGuards, Req, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { VoteService } from '../vote/services/vote.service';
import { FeedService } from '../feed/feed.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserPayload } from 'src/types/user-payload';

@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly feedService: FeedService,
    private readonly voteService: VoteService,
    private readonly projectUserService: ProjectUserService,
  ) {}

  private async getProjectUser(projectId: number, userId: number) {
    return this.projectUserService.getProjectUser(projectId, userId);
  }

  // PUT /api/like/feed/:feedId/:projectId
  @Put('/feed/:feedId/:projectId')
  @UseGuards(JwtAuthGuard)
  async toggleFeedLike(
    @Param('feedId') feedId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUser = await this.getProjectUser(projectId, userId);
    const feed = await this.feedService.getFeedByFeedId(feedId);
    return this.likeService.toggleLike({ feed, projectUser });
  }

  // PUT /api/like/vote/:voteId/:projectId
  @Put('vote/:voteId/user/:projectUserId')
  @UseGuards(JwtAuthGuard)
  async toggleVoteLike(
    @Param('voteId') voteId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUser = await this.getProjectUser(projectId, userId);
    const vote = await this.voteService.getVoteByVoteId(voteId);
    return this.likeService.toggleLike({ vote, projectUser });
  }

  // GET /api/like/feed/:feedId
  @Get('/feed/:feedId/:projectId')
  @UseGuards(JwtAuthGuard)
  async getFeedLikes(
    @Param('feedId') feedId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return this.likeService.getFeedLikes(feedId);
  }
}
