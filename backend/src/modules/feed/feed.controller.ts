import {
  Body,
  Controller,
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

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly fileService: FileService,
  ) {}

  @Post('create-feed')
  @UseGuards(JwtAuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor('community_image'))
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @Req() req: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
  }
}
