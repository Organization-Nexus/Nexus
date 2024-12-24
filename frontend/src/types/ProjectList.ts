export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image?: string;
}

export interface ProjectListProps {
  projects: Project[];
}
