import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Milestone } from 'src/modules/milestone/entities/milestone.entity';

@Entity('issue')
export class Issue {
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
  expected_results: string;

  @Column({ length: 20 })
  category: string; // FE, BE

  @Column({ length: 20 })
  label: string; // feature, refactor, bug, setting, test

  @Column({ length: 50 })
  branch: string;

  @ManyToOne(() => ProjectUser, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;

  @ManyToOne(() => Milestone, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
