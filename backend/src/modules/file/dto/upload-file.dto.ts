import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNumber()
  @IsNumber()
  projectId?: number;

  @IsString()
  category: string;
}
