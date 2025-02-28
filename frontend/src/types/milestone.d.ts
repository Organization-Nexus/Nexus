import { Project } from "./project";

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
  note?: string | null;
  participant_ids: number[];
}

export interface CreateMilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export interface UpdateMilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  initialData: Milestone;
}

export interface UpdateMilestone {
  title?: string;
  content?: string;
  category?: "FE" | "BE";
  start_date?: string;
  end_date?: string;
  goal?: string;
  note?: string | null;
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

export interface ValidationMilestoneErrors {
  title?: string;
  content?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  goal?: string;
  note?: string;
  participant_ids?: string;
}
