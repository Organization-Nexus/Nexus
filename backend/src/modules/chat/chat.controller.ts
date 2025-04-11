import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ChatsService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('available-users')
  async getAvailableChatUsers(@Request() req) {
    return this.chatsService.getAvailableChatUsers(req.user.id);
  }

  @Post('personal')
  async createPersonalChat(
    @Request() req,
    @Body() body: { targetUserId: number },
  ) {
    return this.chatsService.createOrGetPersonalChat(
      req.user.id,
      body.targetUserId,
    );
  }

  @Get('user-projects')
  async getUserProjects(@Request() req) {
    return this.chatsService.getUserProjects(req.user.id);
  }

  @Get('project-members/:projectId')
  async getProjectMembers(
    @Param('projectId') projectId: number,
    @Request() req,
  ) {
    return this.chatsService.getProjectMembers(projectId, req.user.id);
  }

  @Post('project-group')
  async createProjectGroupChat(
    @Request() req,
    @Body() body: { projectId: number; title: string; memberIds: number[] },
  ) {
    return this.chatsService.createProjectGroupChat(
      body.projectId,
      body.title,
      req.user.id,
      body.memberIds,
    );
  }

  @Get('rooms')
  async getUserChatRooms(@Request() req) {
    return this.chatsService.getUserChatRooms(req.user.id);
  }

  @Get('room/:roomId/messages')
  async getChatRoomMessages(@Request() req, @Param('roomId') roomId: number) {
    return this.chatsService.getChatRoomMessages(roomId, req.user.id);
  }

  @Post('room/:roomId/messages')
  async sendMessage(
    @Request() req,
    @Param('roomId') roomId: number,
    @Body() body: { content: string },
  ) {
    return this.chatsService.sendMessage(roomId, req.user.id, body.content);
  }
}
