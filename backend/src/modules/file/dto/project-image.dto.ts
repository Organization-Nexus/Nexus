import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectImageDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  projectId: string;
}
