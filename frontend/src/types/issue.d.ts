import { Project } from "./project";

export interface Issue {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  content: string;
  category: "FE" | "BE";
  label: string;
  expected_results: string;
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

export interface CreateIssue {
  title: string;
  start_date: string;
  end_date: string;
  content: string;
  category: "FE" | "BE";
  label: string;
  expected_results: string;
  participant_ids: number[];
}

export interface CreateIssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export interface UpdateIssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  initialData: Issue;
}

export interface UpdateIssue {
  title?: string;
  start_date?: string;
  end_date?: string;
  content?: string;
  category?: "FE" | "BE";
  label?: string;
  expected_results?: string;
  participant_ids?: number[];
}

interface IssueData {
  id: string;
  user: string;
  category: "FE" | "BE";
  title: string;
  createdAt: string;
}

export interface ValidationIssueErrors {
  title?: string;
  start_date?: string;
  end_date?: string;
  content?: string;
  category?: string;
  label?: string;
  expected_results?: string;

  participant_ids?: string;
}
