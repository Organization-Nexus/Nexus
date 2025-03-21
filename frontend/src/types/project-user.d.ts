// Project User Informations
export interface ProjectUser {
  id: number;
  position: string;
  user: UserInfo;
  joined_at: string;
  is_ban: boolean;
  is_sub_admin: boolean;
}

// User Info (Minimized User Data)
export interface UserInfo {
  email: string;
  name: string;
  phoneNumber: string;
  githubUrl?: string;
  log: { profileImage: string };
}

// Props : ProjectUsers
export interface ProjectUserListProps {
  projectUsers: ProjectUser[];
}
