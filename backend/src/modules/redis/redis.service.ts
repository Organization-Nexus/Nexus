import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '../../config/redis.config';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    const config = redisConfig();
    this.redis = new Redis({
      host: config.host,
      port: config.port,
    });
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
