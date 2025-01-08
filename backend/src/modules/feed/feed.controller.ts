import {
  Body,
  ClassSerializerInterceptor,
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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // POST /api/feed/:projectId/create-feed
  // @Post(':projectId/create-feed')
  // @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  // @UseInterceptors(FileInterceptor('feed_file'))
  // async createFeed(
  //   @Param('projectId') projectId: number,
  //   @Body() createFeedDto: CreateFeedDto,
  //   @Req() req: UserPayload,
  //   @UploadedFile() file?: Express.Multer.File,
  // ) {
  //   const userId = req.user.id;

  //   // 피드 생성 서비스 호출
  //   const feed = await this.feedService.createFeed(
  //     createFeedDto,
  //     projectId,
  //     userId,
  //   );

  //   return {
  //     message: 'Feed created successfully',
  //     feed,
  //   };
  // }
}
