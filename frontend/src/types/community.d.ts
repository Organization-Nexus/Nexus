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
  id: number;
  title: string;
  content: string;
  community_files?: string[];
  createdAt: string;
  isNotice: boolean;
  author: Author;
}

// Community Author Informations
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

// Props : Feeds And Notices
export interface ItemListProps<T> {
  items: T[];
}
export type FeedListProps = ItemListProps<Community>;
export type NoticeListProps = ItemListProps<Notice>;
