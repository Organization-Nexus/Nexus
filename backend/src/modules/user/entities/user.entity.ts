import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 20,
  })
  phoneNumber: string;

  @Column({
    length: 20,
  })
  mainPosition: string;

  @Column({
    nullable: true,
  })
  githubUrl: string;

  @Column({
    default: 'USER',
    length: 20,
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
