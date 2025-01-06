import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectImageDto } from './dto/update-project-image.dto';
import { ProjectUser } from '../project-user/entites/project-user.entity';
import { ProjectNotFoundException } from './exception/project-exception';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  // 프로젝트 생성
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  // 프로젝트 이미지 업데이트
  async updateProjectImage(
    updateProjectImageDto: UpdateProjectImageDto,
  ): Promise<Project> {
    const { projectId, project_image } = updateProjectImageDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    project.project_image = project_image;
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
  async getProjectDetail(projectId: number): Promise<Project> {
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
