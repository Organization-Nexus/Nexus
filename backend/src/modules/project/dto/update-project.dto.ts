import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  projectId: number;

  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsDateString()
  start_date?: string;

  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  project_image?: string;
}
