import { IsString } from 'class-validator';

export class UpdateProjectImageDto {
  @IsString()
  projectId: number;

  @IsString()
  imageUrl: string;
}
