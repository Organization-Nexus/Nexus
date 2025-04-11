import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatsService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/chat-message.entity';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { User } from '../user/entities/user.entity';
import { ChatsController } from './chat.controller';
import { ChatParticipant } from './entities/chat-participant.entity';
import { UserLog } from '../user/entities/user-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      Message,
      ChatParticipant,
      ProjectUser,
      User,
      UserLog,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
    }),
  ],
  controllers: [ChatsController],
  providers: [ChatGateway, ChatsService],
  exports: [ChatsService],
})
export class ChatModule {}
