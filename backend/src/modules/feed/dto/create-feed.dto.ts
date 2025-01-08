import { IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  feed_file?: string;
}
