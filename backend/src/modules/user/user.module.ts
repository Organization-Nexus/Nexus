import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLog } from './entities/user-log.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserLog]), FileModule], // UserRepository를 제공
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
