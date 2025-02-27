import { Feed } from 'src/modules/feed/entites/feed.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Vote } from 'src/modules/vote/entities/vote.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // Community
  @ManyToOne(() => Feed, (feed) => feed.likes, { onDelete: 'CASCADE' })
  feed: Feed | null;
  @ManyToOne(() => Vote, (vote) => vote.likes, { onDelete: 'CASCADE' })
  vote: Vote | null;

  // ETC

  @ManyToOne(() => ProjectUser, { onDelete: 'CASCADE' })
  projectUser: ProjectUser;

  @CreateDateColumn()
  createdAt: Date;
}
