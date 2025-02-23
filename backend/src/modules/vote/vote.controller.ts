import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VoteService } from './services/vote.service';
import { VoteOptionService } from './services/vote-options.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UserPayload } from 'src/types/user-payload';
import { ProjectUserService } from '../project-user/project-user.service';
import { CommunityService } from '../community/community.service';
import { FileService } from '../file/file.service';
import { Category } from 'src/types/enum/file-category.enum';
import { VoteRequestDto } from './dto/vote-request.dto';
import { VoteResponseService } from './services/vote-response.service';
import { AnonymousVoteException } from './exception/vote.exception';

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
  @UseInterceptors(FilesInterceptor('community_files'))
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

  // PATCH /api/vote/vote-response/:voteId/:projectId
  @Patch('vote-response/:voteId/:projectId')
  @UseGuards(JwtAuthGuard)
  async voteResponse(
    @Body() voteRequestDto: VoteRequestDto,
    @Param('voteId') voteId: number,
    @Param('projectId') projectId: number,
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
    await this.voteResponseService.handleExistingVoteResponse(
      voteId,
      projectUser,
    );
    const newVoteResponses = await this.voteResponseService.createVoteResponse(
      vote,
      projectUser,
      selectedOptions,
    );
    return newVoteResponses;
  }

  // GET /api/vote/vote-options/:voteId/:projectId
  @Get('vote-options/:voteId/:projectId')
  @UseGuards(JwtAuthGuard)
  async getVoteOptionsByVoteId(
    @Param('projectId') projectId: number,
    @Param('voteId') voteId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    const vote = await this.voteService.getVoteByVoteId(voteId);
    if (vote.isAnonymous) {
      throw new AnonymousVoteException();
    }
    return await this.voteOptionService.getVoteOptionsByVoteId(
      voteId,
      projectUserId,
    );
  }

  // GET /api/vote/:voteId/:projectId
  @Get(':voteId/:projectId')
  @UseGuards(JwtAuthGuard)
  async getVoteByVoteId(
    @Param('projectId') projectId: number,
    @Param('voteId') voteId: number,
    @Req() req: UserPayload,
  ) {
    const userId = req.user.id;
    const projectUserId =
      await this.projectUserService.validateProjectMemberByUserId(
        projectId,
        userId,
      );
    return await this.voteService.getVoteByVoteId(voteId);
  }
}
