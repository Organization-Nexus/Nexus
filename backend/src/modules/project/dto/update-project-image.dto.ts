import { IsString } from 'class-validator';

export class UpdateProjectImageDto {
  @IsString()
  projectId: number;

  @IsString()
  project_image: string;
}
