import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { CommunityType } from 'src/types/enum/community.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feed')
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  title: string;

  @Column({ length: 2000, nullable: true })
  description: string;

  @Column({ nullable: true })
  community_image: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'enum', enum: CommunityType })
  type: CommunityType;

  @ManyToOne(() => ProjectUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_user_id' })
  projectUser: ProjectUser;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
