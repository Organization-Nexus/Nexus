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
  UpdateDateColumn,
} from 'typeorm';
import { MilestoneParticipant } from './milestone-participant.entity';

@Entity('milestone')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ length: 2000 })
  content: string;

  @Column({ length: 1000 })
  goal: string;

  @Column({ length: 255, nullable: true })
  note: string;

  @Column({ length: 20 })
  category: string; // FE, BE

  @ManyToOne(() => ProjectUser, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(
    () => MilestoneParticipant,
    (participant) => participant.milestone,
    {
      onDelete: 'CASCADE',
    },
  )
  participants: MilestoneParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
