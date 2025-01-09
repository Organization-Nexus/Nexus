import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export class SendResetCodeDto {
  @IsEmail()
  email: string;
}

export class VerifyResetCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;

  @IsString()
  // @MinLength(8)
  newPassword: string;
}
