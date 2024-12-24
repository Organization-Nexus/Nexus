import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { IsOwnerGuard } from '../auth/guard/is-owner.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { UserLog } from './entities/user-log.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 모든 사용자 조회, ADMIN
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }

  // 본인 정보 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Req() req: any) {
    return this.userService.findOne(req.user.id);
  }

  // id값으로 특정 유저 조회
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  // 본인 정보 변경
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  // 유저 정보 변경, ADMIN
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  @Put(':id([0-9]+)')
  async updateUserById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // 본인 상태 변경
  @UseGuards(JwtAuthGuard)
  @Put('status')
  async updateUserStatus(
    @Req() req: any,
    @Body() body: { status: string },
  ): Promise<UserLog> {
    const result = await this.userService.updateStatus(
      req.user.id,
      body.status,
    );

    return result;
  }

  // 유저 삭제
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
