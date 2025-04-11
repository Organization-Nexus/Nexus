import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ChatRoom } from './chat-room.entity';
import { User } from 'src/modules/user/entities/user.entity';

export enum ChatRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('chat_participant')
export class ChatParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatParticipants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.participants)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @Column({ name: 'chat_room_id' })
  chatRoomId: number;

  @Column({
    type: 'enum',
    enum: ChatRole,
    default: ChatRole.MEMBER,
  })
  role: ChatRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}
