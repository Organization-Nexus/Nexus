import { Controller, Get, UseGuards } from '@nestjs/common';
import { PingService } from './ping.service';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  getHello(): string {
    return this.pingService.getPong();
  }
}
