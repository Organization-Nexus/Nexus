import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VoteService } from './services/vote.service';
import { VoteOptionService } from './services/vote-options.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UserPayload } from 'src/types/user-payload';
import { ProjectUserService } from '../project-user/project-user.service';
import { CommunityService } from '../community/community.service';
import { FileService } from '../file/file.service';
import { Category } from 'src/types/enum/file-category.enum';
import { VoteRequestDto } from './dto/vote-request.dto';
import { VoteResponseService } from './services/vote-response.service';

@Controller('vote')
export class VoteController {
  constructor(
    private readonly voteService: VoteService,
    private readonly voteOptionService: VoteOptionService,
    private readonly voteResponseService: VoteResponseService,
    private readonly projectUserService: ProjectUserService,
    private readonly communityService: CommunityService,
    private readonly fileService: FileService,
  ) {}

  // POST /api/vote/create-vote/:projectId
  @Post('create-vote/:projectId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('community_files'))
  async createVote(
    @Body() createVoteDto: CreateVoteDto,
    @Param('projectId') projectId: number,
    @Req() req: UserPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const userId = req.user.id;
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      userId,
    );
    const communityId =
      await this.communityService.getCommunityByProjectId(projectId);
    const communityFiles =
      files && files.length > 0
        ? await this.fileService.handleFileUpload({
            files,
            userId,
            projectId,
            category: Category.COMMUNITY,
          })
        : null;
    const vote = await this.voteService.createVote(
      createVoteDto,
      communityId,
      projectUser,
      communityFiles,
    );
    const voteOptions = await this.voteOptionService.createVoteOptions(
      createVoteDto.options,
      vote,
    );
    return { vote, voteOptions };
  }

  // POST /api/vote/vote-response/:voteId/:projectId
  @Post('vote-response/:voteId/:projectId')
  @UseGuards(JwtAuthGuard)
  async voteResponse(
    @Body() voteRequestDto: VoteRequestDto,
    @Param('projectId') projectId: number,
    @Param('voteId') voteId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const vote = await this.voteService.getVoteByVoteId(voteId);
    const selectedOptions = await this.voteOptionService.validateVoteOptions(
      voteId,
      voteRequestDto.optionId,
    );
    const projectUser = await this.projectUserService.getProjectUser(
      projectId,
      userId,
    );
    return await this.voteResponseService.createVoteResponse(
      vote,
      projectUser,
      selectedOptions,
    );
  }

  // GET /api/vote/vote-response/:voteOptionId/:projectId
  @Get('vote-response/:voteOptionId/:projectId')
  @UseGuards(JwtAuthGuard)
  async getVoteResponseByOptionId(
    @Param('projectId') projectId: number,
    @Param('voteOptionId') voteOptionId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    await this.projectUserService.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.voteOptionService.getVoteOptionDetails(voteOptionId);
  }
}
