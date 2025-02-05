import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  mainPosition?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string; // 기존 이미지 URL을 위한 필드

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  rank?: number;
}
