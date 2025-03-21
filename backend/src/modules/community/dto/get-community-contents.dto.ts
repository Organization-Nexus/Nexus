import {
  IsBoolean,
  IsDate,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetCommunityContentsDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  community_files: string[];

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  @IsOptional()
  isNotice: boolean;

  @IsNumber()
  likeCount: number;

  @IsBoolean()
  likedByUser: boolean;

  @IsBoolean()
  @IsOptional()
  isImportant: boolean;

  author: AuthorDto;
}

class AuthorDto {
  @IsNumber()
  projectUserId: number;

  @IsString()
  position: string;

  user: UserDto;
}

class UserDto {
  @IsString()
  name: string;

  log: LogDto;
}

class LogDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  profileImage: string;

  @IsNumber()
  rank: number;
}
