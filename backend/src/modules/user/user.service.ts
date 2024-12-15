import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './entities/user-log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>, // UserLog repository 추가
  ) {}

  // 특정 유저 조회
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['log'], // UserLog 관계 로드
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // 전체 유저 조회
  async getAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['log'], // UserLog 관계 로드
    });
  }

  // 유저 정보 수정
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.profileImage) {
      user.log.profileImage = updateUserDto.profileImage;
    }

    // User 엔티티 수정
    Object.assign(user, updateUserDto);
    // User, UserLog 저장
    return this.userRepository.save(user);
  }

  // 유저 삭제
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}
