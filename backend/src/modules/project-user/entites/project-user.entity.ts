import { MinutesParticipant } from 'src/modules/minutes/entities/minutes-participant.entity';
import { Minutes } from 'src/modules/minutes/entities/minutes.entity';
import { Feed } from 'src/modules/feed/entites/feed.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum ProjectPosition {
  FE = 'FE',
  BE = 'BE',
  FULL = 'FULL',
  DESIGN = 'DESIGN',
  PM = 'PM',
}

@Entity('project_user')
export class ProjectUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ProjectPosition,
  })
  position: ProjectPosition;

  @CreateDateColumn()
  joined_at: Date;

  @Column({ type: 'boolean', default: false })
  is_ban: boolean;

  @Column({ type: 'boolean', default: false })
  is_sub_admin: boolean;

  @ManyToOne(() => Project, (project) => project.projectUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Feed, (feed) => feed.author)
  feeds: Feed[];

  @OneToMany(() => Minutes, (minutes) => minutes.author)
  minutes: Minutes[];

  @OneToMany(() => MinutesParticipant, (participant) => participant.member)
  meetingParticipations: MinutesParticipant[];
}
