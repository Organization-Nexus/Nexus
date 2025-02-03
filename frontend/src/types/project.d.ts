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

// Create Project
export interface CreateProject {
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

// Props : Projects
export interface ProjectListProps {
  projects: Project[];
}

// Props: Project
export interface ProjectProps {
  project: Project;
}
