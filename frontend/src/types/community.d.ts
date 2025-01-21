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

// Community Informations
export interface Community {
  title: string;
  content: string;
  community_files?: string[];
  createdAt: string;
  isNotice: boolean;
}

// Community Detail
export interface CommunityDetail extends Community {
  id: number;
  author: Author;
}

// Community Author Informations
export interface Author {
  name: string;
  profileImage: string;
  position: string;
  rank: Rank;
  status: Status;
}

// Notice Detail
export interface Notice extends Community {
  isImportant: boolean;
}

// Props : Feeds And Notices
export interface ItemListProps<T> {
  items: T[];
}
export type FeedListProps = ItemListProps<Community>;
export type NoticeListProps = ItemListProps<Notice>;
