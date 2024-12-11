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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
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
      throw new EmailAlreadyExistsException(email); // 이메일 중복 처리
    }

    dto.password = await bcrypt.hash(password, 10);
    dto.role = role; // 기본값 설정

    return this.userRepository.save(dto);
  }
}
