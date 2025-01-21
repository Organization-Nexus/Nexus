import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFeedNoticeDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  feed_files?: string;

  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;
}
