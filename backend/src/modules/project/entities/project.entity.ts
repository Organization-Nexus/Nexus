import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @CreateDateColumn()
  createAt: Date;

  @Column({ nullable: true })
  project_image: string;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers: ProjectUser[];
}
