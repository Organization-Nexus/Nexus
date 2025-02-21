import { Project } from "./project";

export interface Minutes {
  id: number;
  title: string;
  meeting_date: string;
  meeting_time: string;

  agenda: string;
  topic: string;
  content: string;
  decisions: string | null;
  notes: string | null;

  created_at: string;
  author: {
    id: number;
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
        log: {
          profileImage: string;
        };
      };
    };
  }>;
}

// export interface Author {
//   id: number;
//   position: string;
//   user: {
//     name: string;
//   };
//   joined_at: string;
//   is_ban: boolean;
//   is_sub_admin: boolean;
// }

// export interface Participant {
//   id: number;
//   member: {
//     id: number;
//     user: {
//       name: string;
//       log: {
//         profileImage: string;
//       };
//     };
//   };
// }

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
  participant_ids?: number[];
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
