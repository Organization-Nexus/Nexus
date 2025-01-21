import { ProjectUser } from "./project-user";

// Project Informations
export interface Project {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: File | string;
}

// Project Detail
export interface ProjectDetail extends Project {
  id: number;
  projectUsers: ProjectUser[];
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
