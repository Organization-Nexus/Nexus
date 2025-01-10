import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { FileService } from '../file/file.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UserPayload } from 'src/types/user-payload';
import { Category } from 'src/types/enum/file-category.enum';
import { ProjectUserService } from '../project-user/project-user.service';
import { CommunityService } from '../community/community.service';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly fileService: FileService,
    private readonly projectUserService: ProjectUserService,
    private readonly communityService: CommunityService,
  ) {}

  // POST /api/feed/create-feed
  @Post('create-feed/:projectId')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('feed_file'))
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const projectUser = await this.projectUserService.validateProjectMember(
      projectId,
      userId,
    );
    const community =
      await this.communityService.getCommunityByProjectId(projectId);

    let feedImageUrl = null;
    if (file) {
      feedImageUrl = await this.fileService.handleFileUpload({
        file,
        userId,
        projectId,
        category: Category.COMMUNITY,
      });
    }
    return await this.feedService.createFeed(
      createFeedDto,
      feedImageUrl,
      community,
      projectUser,
    );
  }
}
