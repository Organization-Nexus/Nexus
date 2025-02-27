export interface Milestone {
  id: number;
  title: string;
  content: string;
  category: "FE" | "BE";
  start_date: string;
  end_date: string;
  goal: string;
  note?: string;
  author: {
    id: number;
    position: string;
    user: {
      name: string;
      position: string;
      log: {
        profileImage: string;
      };
    };
  };
  participants: Array<{
    id: number;
    member: {
      id: number;
      user: {
        name: string;
        position: string;
        log: {
          profileImage: string;
        };
      };
    };
  }>;
}

export interface CreateMilestone {
  title: string;
  content: string;
  category: "FE" | "BE";
  start_date: string;
  end_date: string;
  goal: string;
  note?: string;
  participant_ids: number[];
}

export interface UpdateMilestone {
  title?: string;
  content?: string;
  category?: "FE" | "BE";
  start_date?: string;
  end_date?: string;
  goal?: string;
  note?: string;
  participant_ids?: number[];
}

interface TaskItemProps {
  user: string;
  date: string;
  task: string;
}

interface MilestoneData {
  id: string;
  user: string;
  category: "FE" | "BE";
  title: string;
  createdAt: string;
}
