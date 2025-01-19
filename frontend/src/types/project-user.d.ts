export interface ProjectUser {
  id: number;
  position: string;
  joined_at: string;
  is_ban: boolean;
  is_sub_admin: boolean;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  mainPosition: string;
  githubUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  log: Log;
}

export interface Log {
  user_id: number;
  profileImage: string;
  rank: number;
  status: string;
  lastLoggedIn: string | null;
  lastLoggedOut: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
}

export interface ProjectUserProps {
  projectUsers: ProjectUser[];
}
