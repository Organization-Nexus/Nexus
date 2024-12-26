import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => [
        {
          ttl: Number(configService.get('THROTTLE_TTL')),
          limit: Number(configService.get('THROTTLE_LIMIT')),
        },
      ],
      inject: [ConfigService],
    }),
  ],
})
export class RateLimitingModule {}
