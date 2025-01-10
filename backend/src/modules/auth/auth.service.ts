import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import {
  EmailAlreadyExistsException,
  LoginFailedException,
} from './exception/auth.exception';
import { UserLog } from '../user/entities/user-log.entity';
import { plainToClass } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';
import { UserNotFoundException } from '../user/exception/user.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../mailer/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    // 이메일 or 비밀번호 불일치
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new LoginFailedException();
    }

    const { password: _, ...result } = user;
    return result;
  }

  // 로그인
  async login(LoginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: LoginDto.email });
    const payload = { id: user.id, email: user.email, role: user.role };

    // Access Token 생성
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '8h',
    });

    // Refresh Token 생성
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Redis에 Refresh Token 저장
    await this.redisService.set(
      `refresh:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60, // 7일
    );

    // 마지막 로그인 시간 업데이트
    await this.userLogRepository.update(
      { user: { id: user.id } },
      { lastLoggedIn: new Date() },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // 로그아웃
  async logout(userId: number) {
    await this.redisService.del(`refresh:${userId}`);

    // 마지막 로그아웃 시간 업데이트
    await this.userLogRepository.update(
      { user: { id: userId } },
      { lastLoggedOut: new Date() },
    );

    return { message: '로그아웃 되었습니다.' };
  }

  // Refresh Token 검증 및 새 Access Token 발급
  async refreshToken(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const payload = { id: user.id, email: user.email, role: user.role };

    // 새로운 access token 발급
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '8h',
    });

    return {
      access_token: accessToken,
    };
  }

  // 회원가입
  async register(dto: RegisterDto): Promise<User> {
    const {
      email,
      password,
      name,
      phoneNumber,
      mainPosition,
      githubUrl,
      role = 'USER', // 기본값 설정
    } = dto;
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new EmailAlreadyExistsException(email);
    }

    dto.password = await bcrypt.hash(password, 10);
    dto.role = role; // 기본값 설정

    const user = this.userRepository.create(dto);

    const userLog = new UserLog();
    userLog.user = user;

    user.log = userLog;

    const savedUser = await this.userRepository.save(user);

    // 순환 참조 방지를 위해 반환할 때 class-transformer 사용
    return plainToClass(User, savedUser);
  }

  // 비밀번호 변경
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  // 비밀번호 재설정 코드 전송
  async sendPasswordResetCode(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UserNotFoundException();
    }

    // 6자리 랜덤 코드 생성
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Redis에 코드 저장 (5분 유효)
    await this.redisService.set(`passwordReset:${email}`, resetCode, 5 * 60);

    // 이메일 전송을 큐에 추가
    await this.emailService.sendPasswordResetEmail(email, {
      code: resetCode,
      name: user.name,
      expireMinutes: 5,
      logoUrl: this.configService.get('LOGO_URL'),
      year: new Date().getFullYear(),
    });

    return {
      message:
        '비밀번호 재설정 코드가 이메일로 전송되고 있습니다. 잠시만 기다려주세요.',
    };
  }

  // 재설정 코드 검증
  async verifyResetCode(email: string, code: string) {
    const savedCode = await this.redisService.get(`passwordReset:${email}`);

    if (!savedCode || savedCode !== code) {
      throw new BadRequestException('유효하지 않은 코드입니다.');
    }

    return { message: '코드가 확인되었습니다.' };
  }

  // 비밀번호 재설정
  async resetPassword(dto: ResetPasswordDto) {
    const { email, code, newPassword } = dto;

    // 코드 재확인
    const savedCode = await this.redisService.get(`passwordReset:${email}`);
    if (!savedCode || savedCode !== code) {
      throw new BadRequestException('유효하지 않은 코드입니다.');
    }

    // 비밀번호 재설정
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UserNotFoundException();
    }

    // 새 비밀번호 해시화 및 저장
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    // Redis에서 코드 삭제
    await this.redisService.del(`passwordReset:${email}`);

    return { message: '비밀번호가 성공적으로 재설정되었습니다.' };
  }
}
