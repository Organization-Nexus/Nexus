import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ProjectPosition,
  ProjectUser,
} from '../project-user/entites/project-user.entity';
import { ProjectNotFoundException } from './exception/project-exception';
import { CommunityService } from '../community/community.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    private readonly projectUserService: ProjectUserService,

    private readonly communityService: CommunityService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(project);

    await this.communityService.createCommunity(savedProject.id);
    await this.projectUserService.createProjectUser({
      projectId: savedProject.id,
      userId: userId,
      position: ProjectPosition.PM,
      is_sub_admin: true,
    });

    return savedProject;
  }

  // 프로젝트 수정
  async updateProject(updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { projectId, ...updateFields } = updateProjectDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new Error('Project not found');
    }
    Object.assign(project, updateFields);
    return await this.projectRepository.save(project);
  }

  // 나의 프로젝트 목록 조회
  async getMyProjects(userId: number): Promise<Project[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'project.projectUsers'],
    });
    return projectUsers.map((projectUser) => projectUser.project);
  }

  // 프로젝트 상세 조회
  async getProjectDetail(projectId: number, userId: number): Promise<Project> {
    await this.projectUserService.validateProjectMember(projectId, userId);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['projectUsers', 'projectUsers.user'],
    });
    if (!project) {
      throw new ProjectNotFoundException(projectId);
    }
    return project;
  }
}
