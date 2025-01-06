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

  @Column({ length: 100 })
  content: string;

  @Column({ nullable: true })
  feed_image: string;

  @ManyToOne(() => ProjectUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectUser_id' })
  project_user: ProjectUser;

  @ManyToOne(() => Community, (community) => community.feeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: Community;
}
