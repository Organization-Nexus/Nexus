import { Feed } from 'src/modules/feed/entites/feed.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Vote } from 'src/modules/vote/entities/vote.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => ProjectUser, (projectUser) => projectUser.comments)
  @JoinColumn({ name: 'projectUserId' })
  projectUser: ProjectUser;

  @ManyToOne(() => Feed, (feed) => feed.comments, { nullable: true })
  @JoinColumn({ name: 'feedId' })
  feed: Feed;

  @ManyToOne(() => Vote, (vote) => vote.comments, { nullable: true })
  @JoinColumn({ name: 'voteId' })
  vote: Vote;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
