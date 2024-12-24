export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url?: string;
}

export interface ProjectListProps {
  projects: Project[];
}
