import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';

export class CreateFeedDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  feed_file?: string;

  @IsNumber()
  community_id: number;

  @IsNumber()
  author: number;
}
