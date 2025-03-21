import { Community } from 'src/modules/community/entites/community.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { VoteResponse } from './vote-response.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteOption } from './vote-options.entity';
import { Like } from 'src/modules/like/entities/like.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 3000 })
  content: string;

  @Column({ default: false })
  isMultipleChoice: boolean;

  @Column({ default: false })
  isAnonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column('text', { array: true, nullable: true })
  community_files: string[];

  @OneToMany(() => Like, (like) => like.vote)
  likes: Like[];

  @OneToMany(() => VoteOption, (option) => option.vote, {
    cascade: true,
  })
  options: VoteOption[];

  @OneToMany(() => VoteResponse, (response) => response.vote, { cascade: true })
  responses: VoteResponse[];

  @ManyToOne(() => Community, (community) => community.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: Community;

  @ManyToOne(() => ProjectUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;

  @OneToMany(() => Comment, (comment) => comment.vote)
  comments: Comment[];
}
