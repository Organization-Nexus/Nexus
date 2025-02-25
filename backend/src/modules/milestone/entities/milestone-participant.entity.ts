import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Milestone } from './milestone.entity';

@Entity('milestone_participant')
export class MilestoneParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Milestone, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @ManyToOne(() => ProjectUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: ProjectUser;
}
