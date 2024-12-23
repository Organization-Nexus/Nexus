import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

export enum ProjectPosition {
  FE = 'FE',
  BE = 'BE',
  FULL = 'FULL',
  DESIGN = 'DESIGN',
  PM = 'PM',
}

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.projectUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
}
