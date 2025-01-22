enum Rank {
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",
  DIAMOND = "Diamond",
}

enum Status {
  Active = "Active",
  Inactive = "Inactive",
  Banned = "Banned",
}

// Community Information
export interface Community {
  id: number;
  title: string;
  content: string;
  community_files?: string[];
  createdAt: string;
  isNotice: boolean;
  author: Author;
}

// Community Author Information
export interface Author {
  position: string;
  user: {
    name: string;
    log: {
      status: Status;
      profileImage: string;
      rank: Rank;
    };
  };
}

// Notice Detail
export interface Notice extends Community {
  isImportant: boolean;
}

// Props: CommunityClientTaps
export interface CommunityClientTapsProps {
  feeds: Community[];
  notices: Notice[];
}
