import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProjectImageDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
