import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PingModule } from './modules/ping/ping.module';

@Module({
  imports: [DatabaseModule, PingModule],
})
export class AppModule {
  constructor() {
    console.log(
      `🚀 Running Database Login as PostGres User : ${process.env.POSTGRES_USER}`,
    );
  }
}
