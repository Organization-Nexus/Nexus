import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLog } from './user-log.entity';
import { Exclude } from 'class-transformer';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { ChatParticipant } from 'src/modules/chat/entities/chat-participant.entity';
import { Message } from 'src/modules/chat/entities/chat-message.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Exclude()
  @Column({
    length: 100,
  })
  password: string;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 20,
  })
  phoneNumber: string;

  @Column({
    length: 20,
  })
  mainPosition: string;

  @Column({
    nullable: true,
  })
  githubUrl: string;

  @Column({
    default: 'USER',
    length: 20,
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserLog, (userLog) => userLog.user, { cascade: true })
  log: UserLog;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.user, {
    cascade: true,
  })
  projectUsers: ProjectUser[];

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
