import { Community } from 'src/modules/community/entites/community.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Community, (community) => community.votes)
  // community: Community;
}
