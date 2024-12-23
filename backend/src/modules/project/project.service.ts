import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async updateProjectImage(
    projectId: string,
    imageUrl: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new Error('Project not found');
    }
    project.project_image = imageUrl;
    return this.projectRepository.save(project);
  }
}
