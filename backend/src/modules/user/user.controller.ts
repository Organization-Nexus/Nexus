import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { IsOwnerGuard } from '../auth/guard/is-owner.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

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
  @Put(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard, IsOwnerGuard)
  // @Put(':id/status')
  // async updateStatus(
  //   @Param('id') id: number,
  //   @Body() statusDto: { status: string },
  // ) {
  //   return this.userService.updateStatus(id, statusDto.status);
  // }

  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
