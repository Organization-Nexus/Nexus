import { Module } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { ProjectUser } from './entites/project-user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser, Project, User]), UserModule],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
