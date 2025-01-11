import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserLog } from '../user/entities/user-log.entity';
import { RedisModule } from '../redis/redis.module';
import { MailModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLog]),
    PassportModule,
    JwtModule.register({}),
    RedisModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
