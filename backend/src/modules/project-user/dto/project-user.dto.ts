import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ProjectPosition } from '../entites/project-user.entity';

export class ProjectUserDto {
  @IsString()
  projectId?: number;

  @IsString()
  userId: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProjectPosition)
  position: ProjectPosition;

  @IsBoolean()
  is_sub_admin: boolean;
}
