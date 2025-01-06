import { Feed } from 'src/modules/feed/entites/feed.entity';
import { Project } from 'src/modules/project/entities/project.entity';
// import { Notice } from 'src/modules/notice/entites/notice.entites';
// import { Vote } from 'src/modules/vote/entites/vote.entity';
import { CommunityType } from 'src/types/enum/community.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('community')
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CommunityType })
  type: CommunityType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Feed, (feed) => feed.community)
  feeds: Feed[];

  //   @OneToMany(() => Notice, (notice) => notice.community)
  //   notices: Notice[];

  //   @OneToMany(() => Vote, (vote) => vote.community)
  //   votes: Vote[];
}
