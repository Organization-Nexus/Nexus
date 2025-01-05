import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Category } from 'src/types/enum/file-category.enum';

export class S3ConfigDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsNotEmpty()
  userId: number;

  @IsNumber()
  projectId?: number;

  @IsNotEmpty()
  fileType: string;

  @IsEnum(Category)
  category: Category;
}
