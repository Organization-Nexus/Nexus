import { Project } from "./project";

export interface Minutes {
  id: number;
  title: string;
  meeting_date: string;
  meeting_time: string;
  participant_ids: number[];
  agenda: string;
  topic: string;
  content: string;
  decisions: string | null;
  notes: string | null;
}
export interface CreateMinutesFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export interface CreateMinutes {
  title: string;
  meeting_date: string;
  meeting_time: string;
  participant_ids: number[];
  agenda: string;
  topic: string;
  content: string;
  decisions?: string | null;
  notes?: string | null;
}

export interface UpdateMinutes {
  title?: string;
  meeting_date?: string;
  meeting_time?: string;
  participant_ids?: string[];
  agenda?: string;
  topic?: string;
  content?: string;
  decisions?: string | null;
  notes?: string | null;
}

export interface ValidationMinutesErrors {
  title?: string;
  meeting_date?: string;
  meeting_time?: string;
  participant_ids?: string;
  agenda?: string;
  topic?: string;
  content?: string;
  decisions?: string | null;
  notes?: string | null;
}
