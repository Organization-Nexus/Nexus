import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  feed_file?: string;
}
