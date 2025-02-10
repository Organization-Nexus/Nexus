import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  community_files?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isImportant?: boolean;
}
