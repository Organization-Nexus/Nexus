export interface Minutes {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: string[];
  topic: string;
  content: string;
  decisions?: string;
  notes?: string;
}
export interface CreateMinutesFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export interface CreateMinutes {
  title: string;
  date: string;
  time: string;
  participants: string[];
  topic: string;
  content: string;
  decisions?: string;
  notes?: string;
}

export interface UpdateMinutes {
  title?: string;
  date?: string;
  time?: string;
  participants?: string[];
  topic?: string;
  content?: string;
  decisions?: string;
  notes?: string;
}

export interface ValidationMinutesErrors {
  title?: string;
  date?: string;
  time?: string;
  participants?: string;
  topic?: string;
  content?: string;
  decisions?: string;
  notes?: string;
}
