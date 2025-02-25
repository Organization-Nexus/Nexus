import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Minutes } from './minutes.entity';

@Entity('meeting_participant')
export class MinutesParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Minutes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'minutes_id' })
  minutes: Minutes;

  @ManyToOne(() => ProjectUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: ProjectUser;
}
