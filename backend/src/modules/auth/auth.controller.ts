import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import {
  changePasswordDto,
  ResetPasswordDto,
  SendResetCodeDto,
  VerifyResetCodeDto,
} from './dto/change-password.dto';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Body() dto: changePasswordDto, @Req() req) {
    return this.authService.changePassword(
      req.user.id,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @UseGuards(ThrottlerBehindProxyGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } }) // 1분당 1번
  @Post('password-reset/send-code')
  async sendResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendPasswordResetCode(dto.email);
  }

  @Post('password-reset/verify-code')
  async verifyResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(dto.email, dto.code);
  }

  @Post('password-reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
