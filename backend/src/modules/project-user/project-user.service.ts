// project-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserDto } from './dto/project-user.dto';
import { ProjectUser } from './entites/project-user.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import {
  ProjectNotFoundException,
  UserNotFoundException,
} from './exception/project-user.exception';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProjectUser(
    projectUserDto: ProjectUserDto,
  ): Promise<ProjectUser> {
    const { projectId, userId, position, is_sub_admin } = projectUserDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!project) {
      throw new ProjectNotFoundException(projectId);
    }
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return this.projectUserRepository.save({
      project,
      user,
      position,
      is_sub_admin,
    });
  }
}
