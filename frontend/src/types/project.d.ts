export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: string;
  projectUsers: ProjectUser[];
}

export interface ProjectUser {
  id: number;
  position: string;
  joined_at: string;
  is_ban: boolean;
  is_sub_admin: boolean;
}

export interface ProjectListProps {
  projects: Project[];
}
