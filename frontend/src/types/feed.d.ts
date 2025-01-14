export interface FeedNoticeListProps {
  feeds: Feed[];
}

export interface FeedBase {
  title: string;
  content: string;
  feed_files?: string[];
  createdAt: string;
  isNotice: boolean;
}

export interface Feed extends FeedBase {
  id: number;
  author: {
    position: string;
    user: {
      name: string;
      log: {
        status: string;
        profileImage: string;
        rank: string;
      };
    };
  };
}
