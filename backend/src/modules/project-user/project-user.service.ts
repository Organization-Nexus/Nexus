import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserDto } from './dto/project-user.dto';
import { ProjectUser } from './entites/project-user.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import {
  ProjectNotFoundException,
  ThisBroIsAlreadyProjectMemberException,
  UserNotFoundException,
  YouCanNotAccessGetOutException,
  YourNotProjectMemberException,
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
    const { projectId, userId } = projectUserDto;

    const [project, user] = await Promise.all([
      this.projectRepository.findOne({ where: { id: projectId } }),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!project) throw new ProjectNotFoundException(projectId);
    if (!user) throw new UserNotFoundException(userId);

    return this.projectUserRepository.save({
      ...projectUserDto,
      project,
      user,
    });
  }

  // 👋 단순 존재 여부 확인 -> projectUser.id
  async validateProjectMemberByUserId(
    projectId: number,
    userId: number,
  ): Promise<number> {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (!projectUser) {
      throw new YourNotProjectMemberException(userId, projectId);
    }
    return projectUser.id;
  }

  // 프로젝트 멤버인지 확인 -> True면 에러
  async validateIsUserAleadyMember(
    projectId: number,
    userId: number,
  ): Promise<void> {
    const existingProjectUser = await this.projectUserRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (existingProjectUser) {
      throw new ThisBroIsAlreadyProjectMemberException(userId);
    }
  }

  // 👋 상세 정보 -> ProjectUser, ProjectUser인지 판별과 함께
  async getProjectUser(
    projectId: number,
    userId: number,
  ): Promise<ProjectUser> {
    const projectUserId = await this.validateProjectMemberByUserId(
      projectId,
      userId,
    );
    return await this.projectUserRepository.findOneBy({ id: projectUserId });
  }

  // 프로젝트의 모든 멤버 -> ProjectUser[]
  async getProjectUsers(projectId: number): Promise<ProjectUser[]> {
    return await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user', 'user.log'],
    });
  }

  // 관리자 권한 확인
  async checkAdminPermissions(
    projectId: number,
    userId: number,
  ): Promise<void> {
    const projectUser = await this.getProjectUser(projectId, userId);
    if (!projectUser.is_sub_admin) {
      throw new YouCanNotAccessGetOutException(userId);
    }
  }
}
