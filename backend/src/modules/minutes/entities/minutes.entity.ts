import { Project } from 'src/modules/project/entities/project.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MinutesParticipant } from './minutes-participant.entity';

@Entity('minutes')
export class Minutes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ type: 'date' })
  meeting_date: Date;

  @Column({ type: 'time' })
  meeting_time: string;

  @Column({ length: 100 })
  agenda: string;

  @Column({ length: 255 })
  topic: string;

  @Column({ length: 3000 })
  content: string;

  @Column({ length: 255, nullable: true })
  decisions: string;

  @Column({ length: 255, nullable: true })
  notes: string;

  @ManyToOne(() => ProjectUser, (projectUser) => projectUser.minutes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;

  @ManyToOne(() => Project, (project) => project.minutes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => MinutesParticipant, (participant) => participant.minutes, {
    onDelete: 'CASCADE',
  })
  participants: MinutesParticipant[];

  @CreateDateColumn()
  created_at: Date;
}
