import { UserRank, UserStatus } from "@/enum/user.enum";
import { ProjectUser } from "./project-user";

// CommunityTab 타입 정의
export type CommunityTab = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

interface BaseCommunity {
  id: number;
  title: string;
  content: string;
  community_files?: string[] | null;
  community: { id: number };
  author: Author;
  createdAt: string;
  likeCount: number;
  likedByUser: boolean;
}

// Community Information

export interface Community extends BaseCommunity {}
// Notice Detail
export interface Notice extends Community {
  isImportant: boolean;
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
  community_files?: (string | File)[];
  deleted_files?: string[];
  isImportant?: string | boolean;
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

// Props: CommunityClientTaps
export interface CommunityClientTapsProps {
  projectId: string;
  projectUser: ProjectUser;
  feeds: Community[];
  notices: Notice[];
  votes: VoteResponse[];
}

export interface CommunityTemplateProps {
  type: string;
  items: (Community | Notice | Vote)[];
  projectUser: ProjectUser;
  projectId: string;
}

export interface Vote extends BaseCommunity {
  isMultipleChoice: boolean;
  isAnonymous: boolean;
  deadline: string | null;
  voteOptions: VoteOption[];
}

export interface VoteOption {
  id: number;
  content: string;
  voteCount: number;
  isSelectedByUser: boolean;
  response_users: {
    id: number;
    name: string;
    profileImage: string;
    isSelectedByUser: boolean;
  }[];
}

export interface CreateVoteDto {
  title: string;
  content: string;
  isMultipleChoice?: string;
  isAnonymous?: string;
  deadline?: string | null;
  options: string[];
  community_files?: File[];
}

export interface LikeDataResponse {
  id: number;
  name: string;
  profileImage: string;
}
