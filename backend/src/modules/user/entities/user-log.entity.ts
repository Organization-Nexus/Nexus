import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserLog {
  @PrimaryColumn() // User 테이블 기본키 그대로 사용
  user_id: number;

  @Column({ nullable: true })
  profileImage: string;

  @Column({
    default: 0,
  })
  rank: number;

  @Column({
    default: 'ONLINE',
    length: 20,
  })
  status: string;

  @Column({ nullable: true })
  lastLoggedIn: Date;

  // 외래 키 지정
  @OneToOne(() => User, (user) => user.log) // UserLog에서 User를 참조하는 관계
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;
}
