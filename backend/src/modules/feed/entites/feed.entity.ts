import { Community } from 'src/modules/community/entites/community.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Column,
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

  @Column({ nullable: true })
  feed_file: string;

  @ManyToOne(() => Community, (community) => community.feeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: Community;

  @ManyToOne(() => ProjectUser, (projectUser) => projectUser.feeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: ProjectUser;
}
