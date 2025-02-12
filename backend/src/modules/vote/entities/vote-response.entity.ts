import { Vote } from './vote.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { VoteOption } from './vote-options.entity';

@Entity('vote_response')
export class VoteResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vote, (vote) => vote.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vote_id' })
  vote: Vote;

  @ManyToOne(() => VoteOption, (option) => option.response_users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: VoteOption;

  @ManyToOne(() => ProjectUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectUser_id' })
  projectUser: ProjectUser;
}
