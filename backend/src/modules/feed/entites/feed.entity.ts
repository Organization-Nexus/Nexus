import { Community } from 'src/modules/community/entites/community.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feed')
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 2000 })
  content: string;

  @Column('text', { array: true, nullable: true })
  feed_files: string[];

  @Column({ default: false })
  isNotice: boolean;

  @Column({ default: false })
  isImportant: boolean;

  @ManyToOne(() => Community, (community) => community.feeds, {
    onDelete: 'CASCADE',
  })
  community: Community;

  @ManyToOne(() => ProjectUser, (projectUser) => projectUser.feeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;

  @CreateDateColumn()
  createdAt: Date;
}
