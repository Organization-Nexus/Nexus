import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from 'src/modules/user/entities/user.entity';
import { UserLog } from 'src/modules/user/entities/user-log.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { ProjectUser } from 'src/modules/project-user/entites/project-user.entity';
import { Community } from 'src/modules/community/entites/community.entity';
import { Feed } from 'src/modules/feed/entites/feed.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT'), 10),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, UserLog, Project, ProjectUser, Community, Feed],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
