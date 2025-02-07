import { UserRank, UserStatus } from "@/enum/user.enum";
import { ProjectUser } from "./project-user";

// CommunityTab 타입 정의
export type CommunityTab = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

// Community Information
export interface Community {
  id: string;
  title: string;
  content: string;
  community_files?: string[];
  createdAt: string;
  author: Author;
}

// Create Community Form
export interface CreateCommunityForm {
  title: string;
  content: string;
  community_files?: File[];
  isImportant?: string;
}

export interface UpdateCommunityForm {
  title?: string;
  content?: string;
  community_files?: File[];
  delete_files?: string[];
  isImportant?: string;
}

// Community Author Information
export interface Author {
  projectUserId: number;
  position: string;
  user: {
    name: string;
    log: {
      status: UserStatus;
      profileImage: string;
      rank: UserRank;
    };
  };
}

// Notice Detail
export interface Notice extends Community {
  isImportant: boolean;
}
// Props: CommunityClientTaps
export interface CommunityClientTapsProps {
  projectId: string;
  projectUser: ProjectUser;
  feeds: Community[];
  notices: Notice[];
}

export interface CommunityTemplateProps {
  type: string;
  items: (Community | Notice)[];
  projectUser: ProjectUser;
  projectId: string;
}
