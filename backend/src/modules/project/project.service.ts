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
import { UserService } from '../user/user.service';
import { MilestoneService } from '../milestone/milestone.service';
import { Milestone } from '../milestone/entities/milestone.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    private readonly projectUserService: ProjectUserService,

    private readonly userService: UserService,

    private readonly communityService: CommunityService,

    private readonly milestoneService: MilestoneService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(project);

    await this.communityService.createCommunity(savedProject.id);

    const user = await this.userService.findOne(userId);

    const projectUserDto = {
      projectId: savedProject.id,
      userId: userId,
      email: user.email,
      position: ProjectPosition.PM,
      is_sub_admin: true,
    };
    await this.projectUserService.createProjectUser(projectUserDto);
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
  async getProject(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['projectUsers', 'projectUsers.user', 'projectUsers.user.log'],
    });
    if (!project) {
      throw new ProjectNotFoundException(projectId);
    }
    return project;
  }

  async getProjectWithMilestones(
    projectId: number,
    projectUserIds: number[],
  ): Promise<(Project & { milestones: Milestone[] }) | null> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) return null;
    const milestones = await this.milestoneService.getMilestonesByProjectId(
      projectId,
      projectUserIds,
    );
    return { ...project, milestones };
  }

  async getMilestonesByProjectUserIds(
    projectUserIds: number[],
    projectIds: number[],
  ): Promise<(Project & { milestones: Milestone[] })[]> {
    if (!projectUserIds.length || !projectIds.length) return [];
    const projectPromises = projectIds.map((projectId) =>
      this.getProjectWithMilestones(projectId, projectUserIds),
    );
    const results = await Promise.all(projectPromises);
    return results.filter(
      (result): result is Project & { milestones: Milestone[] } =>
        result !== null,
    );
  }
}
