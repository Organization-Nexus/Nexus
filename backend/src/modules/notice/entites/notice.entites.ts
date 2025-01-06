import { Community } from 'src/modules/community/entites/community.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  //   @ManyToOne(() => Community, (community) => community.notices)
  //   community: Community;
}
