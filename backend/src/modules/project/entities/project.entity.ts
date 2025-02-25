import { Community } from 'src/modules/community/entites/community.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ nullable: true })
  project_image: string;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers: ProjectUser[];

  @OneToOne(() => Community, (community) => community.project)
  community: Community;

  // @OneToMany(() => Minutes, (minutes) => minutes.project)
  // minutes: Minutes[];
}
