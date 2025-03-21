import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isMultipleChoice?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isAnonymous?: boolean;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsArray()
  options: string[];

  @IsOptional()
  @IsString()
  community_files?: string[];
}
