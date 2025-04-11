import { Project } from 'src/modules/project/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';
import { Message } from './chat-message.entity';

export enum ChatRoomType {
  PERSONAL = 'PERSONAL',
  GROUP = 'GROUP',
}

@Entity('chat_room')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ChatRoomType,
  })
  type: ChatRoomType;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => Project, (project) => project.chatRooms, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @OneToMany(() => ChatParticipant, (participant) => participant.chatRoom)
  participants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
