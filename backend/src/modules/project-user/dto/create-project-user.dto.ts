import {
  IsString,
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ProjectPosition } from '../entites/project-user.entity';

export class CreatePronectUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProjectPosition)
  position: ProjectPosition;

  @IsBoolean()
  is_sub_admin: boolean;
}
