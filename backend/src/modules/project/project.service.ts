import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.save(createProjectDto);
  }

  async updateProjectImage(
    projectId: string,
    imageUrl: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOneBy({
      id: projectId,
    });
    if (project) {
      project.project_image = imageUrl;
      return await this.projectRepository.save(project);
    }
    throw new Error('Project not found');
  }
}
