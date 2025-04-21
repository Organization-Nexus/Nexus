import { ProjectUser } from "./project-user";

// Project Informations
export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: File | string;
  projectUsers: ProjectUser[];
}

export interface ProjectListProps {
  project: Project[];
}

// Create Project
export interface CreateProject {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: File | string;
}

// Update Project
export interface UpdateProject {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: File | string;
}

// Props : ProgressBar
export interface ProgressBarProps {
  progress: number;
  status?: string;
}

// Props : ProjectId
export interface ProjectIdProps {
  params: {
    projectId: string;
  };
}

// Props: Project
export interface ProjectProps {
  project: Project;
}
