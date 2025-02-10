import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vote } from './vote.entity';
import { VoteResponse } from './vote-response.entity';

@Entity('vote_option')
export class VoteOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vote, (vote) => vote.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vote_id' })
  vote: Vote;

  @Column({ length: 255 })
  content: string;

  @OneToMany(() => VoteResponse, (response) => response.option)
  response_users: VoteResponse[];
}
