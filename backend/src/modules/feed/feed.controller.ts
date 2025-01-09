import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  NotFoundException,
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
import { ProjectUserService } from '../project-user/project-user.service';
import { CommunityService } from '../community/community.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // POST /api/feed/:projectId/create-feed
  @Post(':projectId/create-feed')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('feed_file'))
  async createFeed(
    @Param('projectId') projectId: number,
    @Body() createFeedDto: CreateFeedDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {}
}
