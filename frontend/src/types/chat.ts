export interface ChatUser {
  id: number;
  name: string;
  position: string;
  profileImage?: string;
}

export interface ChatParticipant {
  id: number;
  userId: number;
  chatRoomId: number;
  role: string;
  joinedAt: string;
  user: ChatUser;
}

export interface ChatRoom {
  id: number;
  title: string;
  type: "PERSONAL" | "GROUP";
  projectId: number | null; // projectId 추가
  project?: Project; // project 객체 추가
  lastMessage?: Message;
  unreadCount?: number;
  participants: ChatParticipant[]; // ChatUser[]에서 ChatParticipant[]로 변경

  createdAt: string;
}

export interface Message {
  id: number;
  content: string;
  sender: ChatUser;
  roomId: number;
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  project_image?: string;
}

export interface ProjectMember {
  id: number;
  user: ChatUser;
  role: string;
}

export interface CreateProjectGroupChat {
  projectId: number;
  title: string;
  memberIds: number[];
}
