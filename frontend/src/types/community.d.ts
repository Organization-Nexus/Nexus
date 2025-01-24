import { UserRank, UserStatus } from "@/enum/user.enum";

// CommunityTab 타입 정의
export type CommunityTab = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

// Community Information
export interface Community {
  id: number;
  title: string;
  content: string;
  community_files?: string[];
  createdAt: string;
  author: Author;
}

// Community Author Information
export interface Author {
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
  feeds: Community[];
  notices: Notice[];
}

export interface CommunityTemplateProps {
  type: string;
  items: (Community | Notice)[];
}
