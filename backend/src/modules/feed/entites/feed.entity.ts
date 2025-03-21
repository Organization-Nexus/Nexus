import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Community } from 'src/modules/community/entites/community.entity';
import { Like } from 'src/modules/like/entities/like.entity';
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

@Entity('feed')
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 2000 })
  content: string;

  @Column('text', { array: true, nullable: true })
  community_files: string[];

  @Column({ default: false })
  isNotice: boolean;

  @Column({ default: false })
  isImportant: boolean;

  @OneToMany(() => Like, (like) => like.feed)
  likes: Like[];

  @ManyToOne(() => Community, (community) => community.feeds, {
    onDelete: 'CASCADE',
  })
  community: Community;

  @ManyToOne(() => ProjectUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author' })
  author: ProjectUser;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.feed)
  comments: Comment[];
}
