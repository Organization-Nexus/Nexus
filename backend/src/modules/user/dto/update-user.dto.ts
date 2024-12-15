// src/user/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
  profileImage?: string;
}
