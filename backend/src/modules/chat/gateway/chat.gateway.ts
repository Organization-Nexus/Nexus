import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { ChatsService } from '../chat.service';

interface SocketWithUser extends Socket {
  userId?: number; // 타입을 number로 변경 (JwtPayload의 id가 number 타입이므로)
}

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://13.209.41.52:3000', // 실제 배포 시에는 특정 도메인으로 제한
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatGateway.name);
  private userSocketMap: Map<number, Set<string>> = new Map(); // userId(number) -> socketIds

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatsService: ChatsService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket 서버가 초기화되었습니다.');
  }

  async handleConnection(client: SocketWithUser) {
    try {
      // 토큰에서 사용자 정보 추출
      const token = client.handshake.auth.token;
      console.log('클라이언트 연결됨:', client.id, '토큰:', token);
      if (!token) {
        this.logger.warn(`토큰 없이 소켓 연결 시도: ${client.id}`);
        client.disconnect();
        return;
      }

      let userId: number; // 타입을 number로 변경

      try {
        const payload = this.jwtService.verify<JwtPayload>(token);

        if (payload.id === undefined) {
          throw new Error('토큰에 사용자 ID가 없습니다.');
        }

        userId = payload.id;
      } catch (error) {
        this.logger.warn(`유효하지 않은 토큰: ${error.message}`);
        client.disconnect();
        return;
      }

      // 소켓에 사용자 정보 저장
      client.userId = userId;

      // 사용자-소켓 매핑 업데이트
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, new Set());
      }
      this.userSocketMap.get(userId).add(client.id);

      this.logger.log(`클라이언트 연결됨: ${client.id} (userId: ${userId})`);

      // 사용자의 모든 채팅방에 join
      const chatRooms = await this.chatsService.getUserChatRooms(userId);
      chatRooms.forEach((room) => {
        client.join(room.id.toString());
        this.logger.log(`사용자 ${userId}가 채팅방 ${room.id}에 참여했습니다.`);
      });

      // 연결 성공 이벤트 전송
      client.emit('connection_established', {
        message: '웹소켓 서버에 연결되었습니다.',
        userId,
      });
    } catch (error) {
      this.logger.error(`연결 처리 중 오류: ${error.message}`, error.stack);
      client.disconnect();
    }
  }

  handleDisconnect(client: SocketWithUser) {
    try {
      const userId = client.userId;
      if (userId) {
        // 사용자-소켓 매핑에서 제거
        const userSockets = this.userSocketMap.get(userId);
        if (userSockets) {
          userSockets.delete(client.id);
          // 사용자의 모든 소켓이 연결 해제되면 맵에서 사용자 제거
          if (userSockets.size === 0) {
            this.userSocketMap.delete(userId);
          }
        }
      }

      this.logger.log(
        `클라이언트 연결 해제: ${client.id} (userId: ${client.userId})`,
      );
    } catch (error) {
      this.logger.error(
        `연결 해제 처리 중 오류: ${error.message}`,
        error.stack,
      );
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: number },
  ) {
    if (!client.userId) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }

    client.join(data.roomId.toString());
    this.logger.log(
      `사용자 ${client.userId}가 채팅방 ${data.roomId}에 참여했습니다.`,
    );

    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: number },
  ) {
    if (!client.userId) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }

    client.leave(data.roomId.toString());
    this.logger.log(
      `사용자 ${client.userId}가 채팅방 ${data.roomId}에서 나갔습니다.`,
    );

    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: number; content: string },
  ) {
    try {
      if (!client.userId) {
        return { success: false, error: '인증되지 않은 사용자입니다.' };
      }

      const message = await this.chatsService.sendMessage(
        data.roomId,
        client.userId,
        data.content,
      );

      // 메시지를 채팅방의 모든 참여자에게 브로드캐스트
      this.server.to(data.roomId.toString()).emit('newMessage', message);
      this.logger.log(
        `사용자 ${client.userId}가 채팅방 ${data.roomId}에 메시지를 보냈습니다.`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`메시지 전송 중 오류: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  // 특정 사용자에게 메시지 전송하는 유틸리티 메서드
  sendToUser(userId: number, event: string, data: any) {
    const socketIds = this.userSocketMap.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  //   // 테스트 메시지 처리
  //   @SubscribeMessage('testMessage')
  //   handleTestMessage(client: SocketWithUser, payload: any) {
  //     this.logger.log(
  //       `테스트 메시지 수신: ${JSON.stringify(payload)} (userId: ${client.userId})`,
  //     );

  //     // 메시지를 보낸 사용자에게만 에코
  //     client.emit('testMessage', {
  //       content: `에코: ${payload.content}`,
  //       userId: client.userId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // 다른 모든 사용자에게도 메시지 전송 (선택 사항)
  //     client.broadcast.emit('testMessage', {
  //       content: `${client.userId}님의 메시지: ${payload.content}`,
  //       userId: client.userId,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return {
  //       status: 'ok',
  //       message: '메시지가 성공적으로 처리되었습니다.',
  //     };
  //   }
}
