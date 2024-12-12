import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get(':id')
  // async getUser(@Param('id') id: number) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(':id')
  // async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: number) {
  //   return this.userService.remove(id);
  // }

  // @Patch(':id/status')
  // async updateStatus(@Param('id') id: number, @Body() statusDto: { status: string }) {
  //   return this.userService.updateStatus(id, statusDto.status);
  // }
}
