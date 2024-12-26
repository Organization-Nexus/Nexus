import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLog } from './user-log.entity';
import { Exclude } from 'class-transformer';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';

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
  @Exclude()
  log: UserLog;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.user)
  projectUsers: ProjectUser[];
}
