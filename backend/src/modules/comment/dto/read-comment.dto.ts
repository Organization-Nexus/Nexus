import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsISO8601,
} from 'class-validator';

export class ReadCommentDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsISO8601()
  createdAt: string;

  @IsNotEmpty()
  projectUser: ProjectUserDto;

  @IsArray()
  @IsOptional()
  replies: ReplyDto[];
}

export class ProjectUserDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  profileImage: string;
}

export class ReplyDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsISO8601()
  createdAt: string;

  @IsNotEmpty()
  projectUser: ProjectUserDto;
}
