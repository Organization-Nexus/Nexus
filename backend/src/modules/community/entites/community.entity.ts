import { Feed } from 'src/modules/feed/entites/feed.entity';
import { Project } from 'src/modules/project/entities/project.entity';
// import { Vote } from 'src/modules/vote/entites/vote.entity';
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

  @ManyToOne(() => Project, (project) => project.community, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Feed, (feed) => feed.community)
  feeds: Feed[];

  //   @OneToMany(() => Vote, (vote) => vote.community)
  //   votes: Vote[];
}
