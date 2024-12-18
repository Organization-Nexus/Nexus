import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ nullable: true })
  project_image: string;
}
