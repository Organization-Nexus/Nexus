import { IsString, IsEnum } from 'class-validator';
import { ProjectPosition } from '../entites/project-user.entity';

export class ProjectUserDto {
  @IsString()
  projectId: number;

  @IsString()
  userId: number;

  @IsEnum(ProjectPosition)
  position: ProjectPosition;

  is_sub_admin: boolean;
}
