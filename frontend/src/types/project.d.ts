// 프로젝트의 기본 정보
export interface ProjectBase {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_image: string;
}

// 프로젝트 상세 정보
export interface Project extends ProjectBase {
  id: number;
  projectUsers: ProjectUser[];
}

// 프로젝트 사용자 정보
export interface ProjectUser {
  id: number;
  position: string;
  joined_at: string;
  is_ban: boolean;
  is_sub_admin: boolean;
}

// 프로젝트 목록을 위한 props
export interface ProjectListProps {
  projects: Project[];
}

// 프로젝트 생성 시 필요한 정보
export interface CreateProject extends ProjectBase {}
