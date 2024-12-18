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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    private readonly jwtService: JwtService,
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

    // 로그인 후, 유저 로그의 마지막 로그인 컬럼 업데이트
    await this.userLogRepository.update(
      { user: { id: user.id } },
      { lastLoggedIn: new Date() },
    );
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
    };
  }

  // // 로그아웃
  // async logout(userId: number) {
  //   await this.userLogRepository.update(
  //     { user: { id: userId } },
  //     { lastLoggedOut: new Date() },
  //   );

  //   return { message: '로그아웃 되었습니다.' };
  // }

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
}
