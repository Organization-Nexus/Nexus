import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserDto } from './dto/project-user.dto';
import { ProjectUser } from './entites/project-user.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import {
  AlreadyProjectMemberException,
  ProjectNotFoundException,
  UserNotFoundException,
  YourNotProjectMemberException,
} from './exception/project-user.exception';
import { Bool } from 'aws-sdk/clients/clouddirectory';

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

  async validateProjectMemberByUserId(
    projectId: number,
    userId: number,
  ): Promise<ProjectUser> {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (!projectUser) {
      throw new YourNotProjectMemberException(userId, projectId);
    }
    return projectUser;
  }

  async validateProjectMemberByEmail(
    projectId: number,
    email: string,
  ): Promise<Boolean> {
    const projectUser = await this.projectUserRepository.findOne({
      where: { user: { email }, project: { id: projectId } },
    });
    if (projectUser) {
      throw new AlreadyProjectMemberException(email, projectId);
    }
    return true;
  }

  async getProjectUsers(projectId: number): Promise<ProjectUser[]> {
    return await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user', 'user.log'],
    });
  }
}
