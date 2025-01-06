import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  community_image?: string;
}
