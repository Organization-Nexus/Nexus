import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { FileService } from '../file/file.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateFeedNoticeDto } from './dto/create-feed-notice.dto';
import { UserPayload } from 'src/types/user-payload';
import { Category } from 'src/types/enum/file-category.enum';
import { ProjectUserService } from '../project-user/project-user.service';
import { CommunityService } from '../community/community.service';
import { NoPermissionForNoticeException } from './exception/feed-exception';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly fileService: FileService,
    private readonly projectUserService: ProjectUserService,
    private readonly communityService: CommunityService,
  ) {}

  // POST /api/feed/create-feed/:projectId
  @Post('create-feed/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FilesInterceptor('feed_file'))
  async createFeed(
    @Body() createFeedDto: CreateFeedNoticeDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const userId = req.user.id;
    const projectUser =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    const community =
      await this.communityService.getCommunityByProjectId(projectId);

    let feedFiles = null;
    if (files && files.length > 0) {
      feedFiles = await this.fileService.handleFileUpload({
        files,
        userId: req.user.id,
        projectId,
        category: Category.COMMUNITY,
      });
    }
    return await this.feedService.createFeed(
      createFeedDto,
      feedFiles,
      community,
      projectUser,
    );
  }

  // PATCH /api/feed/update-feed/:feedId/:projectId
  @Patch('update-feed/:feedId/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('feed_file'))
  async updateFeed(
    @Param('feedId') feedId: number,
    @Param('projectId') projectId: number,
    @Body() updateFeedDto: CreateFeedNoticeDto,
    @Req() req: UserPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const userId = req.user.id;
    const { id: projectUserId } =
      await this.projectUserService.validateProjectMemberByUserId(
        userId,
        projectId,
      );
    await this.feedService.validateFeedOwner(feedId, projectUserId);
    let feedFiles = null;
    if (files && files.length > 0) {
      feedFiles = await this.fileService.handleFileUpload({
        files,
        userId: req.user.id,
        projectId,
        category: Category.COMMUNITY,
      });
    }
    return await this.feedService.updateFeed(feedId, updateFeedDto, feedFiles);
  }

  // DELETE /api/feed/delete-feed/:feedId/:projectId
  @Delete('delete-feed/:feedId/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  async deleteFeed(
    @Param('feedId') feedId: number,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const { id: projectUserId } =
      await this.projectUserService.validateProjectMemberByUserId(
        userId,
        projectId,
      );
    await this.feedService.validateFeedOwner(feedId, projectUserId);
    await this.feedService.deleteFeed(feedId);
    return {
      message: `Feed with ID ${feedId} has been successfully deleted.👋`,
    };
  }

  // POST /api/feed/create-notice/:projectId
  @Post('create-notice/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FilesInterceptor('feed_file'))
  async createNotice(
    @Body() createNotceDto: CreateFeedNoticeDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const userId = req.user.id;
    const projectUser =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    if (projectUser.position !== 'PM' && !projectUser.is_sub_admin) {
      throw new NoPermissionForNoticeException();
    }
    const community =
      await this.communityService.getCommunityByProjectId(projectId);
    let feedFiles = null;
    if (files && files.length > 0) {
      feedFiles = await this.fileService.handleFileUpload({
        files,
        userId: req.user.id,
        projectId,
        category: Category.COMMUNITY,
      });
    }
    const isNotice = true;
    return await this.feedService.createFeed(
      createNotceDto,
      feedFiles,
      community,
      projectUser,
      isNotice,
    );
  }
}
