import {
  IsBoolean,
  IsDate,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetFeedNoticeDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  feed_files: string[];

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  isNotice: boolean;

  @IsBoolean()
  isImportant: boolean;

  author: AuthorDto;
}

class AuthorDto {
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
