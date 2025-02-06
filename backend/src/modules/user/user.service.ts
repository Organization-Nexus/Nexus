import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './entities/user-log.entity';
import {
  NotAllowedStatusException,
  UserNotFoundException,
} from './exception/user.exception';
import { FileService } from '../file/file.service';
import { Category } from 'src/types/enum/file-category.enum';

@Injectable()
export class UserService {
  private readonly ALLOWED_STATUS = ['ONLINE', 'OFFLINE', 'AWAY', 'BUSY'];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
  ) {}

  // 이메일로 유저 조회
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  // 특정 유저 조회
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['log'], // UserLog 관계 로드
    });
    if (!user) {
      throw new UserNotFoundException();
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
  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOne(userId);
    const { status, rank, ...userFields } = updateUserDto;

    // UserLog 필드 업데이트
    const previousImageUrl = user.log.profileImage;
    let newImageUrl: string | null = null;

    if (file) {
      // 새 이미지 업로드
      const uploadResult = await this.fileService.handleFileUpload({
        files: [file],
        userId,
        category: Category.AVATAR,
      });
      newImageUrl = uploadResult[0]; // 업로드된 파일의 URL

      // 이전 이미지 삭제
      if (previousImageUrl) {
        console.log('이전 이미지 삭제:', previousImageUrl);
        // await this.fileService.deleteFile(previousImageUrl);
      }
    } else if (updateUserDto.profileImageUrl) {
      newImageUrl = updateUserDto.profileImageUrl;
    }

    user.log.profileImage = newImageUrl;

    if (status !== undefined) {
      if (!this.ALLOWED_STATUS.includes(status)) {
        throw new NotAllowedStatusException();
      }
      user.log.status = status;
    }
    if (rank !== undefined) user.log.rank = rank;

    Object.assign(user, userFields);
    return this.userRepository.save(user);
  }

  // 본인 상태 변경
  async updateStatus(userId: number, status: string): Promise<UserLog> {
    if (!this.ALLOWED_STATUS.includes(status)) {
      throw new NotAllowedStatusException();
    }
    await this.userLogRepository.update({ user_id: userId }, { status });

    const updatedUserLog = await this.userLogRepository.findOne({
      where: { user_id: userId },
    });
    return updatedUserLog;
  }

  // 유저 삭제
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new UserNotFoundException();
    }

    return { message: '사용자가 성공적으로 삭제되었습니다.' };
  }
}
