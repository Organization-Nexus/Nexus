import { Controller, Get, UseGuards } from '@nestjs/common';
import { PingService } from './ping.service';
import { ThrottlerBehindProxyGuard } from '../rate-limiting/rate-limiting.guard';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  @UseGuards(ThrottlerBehindProxyGuard)
  getHello(): string {
    return this.pingService.getPong();
  }
}
