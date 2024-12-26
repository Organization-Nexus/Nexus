import { Controller } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}
}
