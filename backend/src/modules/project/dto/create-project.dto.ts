import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  project_image?: string;
}
