import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectImageDto } from './dto/update-project-image.dto';
import { ProjectUser } from '../project-user/entites/project-user.entity';

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
    const { projectId, imageUrl } = updateProjectImageDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    project.project_image = imageUrl;
    return await this.projectRepository.save(project);
  }

  // 나의 프로젝트 조회
  async getMyProjects(userId: number): Promise<Project[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });
    return projectUsers.map((projectUser) => projectUser.project);
  }
}
