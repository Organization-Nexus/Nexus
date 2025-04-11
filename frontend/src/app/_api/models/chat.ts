import {
  ChatRoom,
  ChatUser,
  Message,
  Project,
  ProjectMember,
} from "@/types/chat";
import api from "../axios";

export const chatApi = {
  // 채팅 가능한 사용자 목록 조회
  getAvailableChatUsers: async (): Promise<ChatUser[]> => {
    return await api
      .get<ChatUser[]>("/chat/available-users")
      .then((res) => res.data);
  },

  // 1:1 채팅방 생성
  createPersonalChat: async (targetUserId: number): Promise<ChatRoom> => {
    return await api
      .post<ChatRoom>("/chat/personal", { targetUserId })
      .then((res) => res.data);
  },

  // 사용자의 프로젝트 목록 조회
  getUserProjects: async (): Promise<Project[]> => {
    return await api
      .get<Project[]>("/chat/user-projects")
      .then((res) => res.data);
  },

  // 프로젝트 멤버 목록 조회
  getProjectMembers: async (projectId: number): Promise<ProjectMember[]> => {
    return await api
      .get<ProjectMember[]>(`/chat/project-members/${projectId}`)
      .then((res) => res.data);
  },

  // 프로젝트 그룹 채팅방 생성
  createProjectGroupChat: async (
    projectId: number,
    title: string,
    memberIds: number[]
  ): Promise<ChatRoom> => {
    return await api
      .post<ChatRoom>("/chat/project-group", { projectId, title, memberIds })
      .then((res) => res.data);
  },

  // 사용자의 채팅방 목록 조회
  getUserChatRooms: async (): Promise<ChatRoom[]> => {
    return await api.get<ChatRoom[]>("/chat/rooms").then((res) => res.data);
  },

  // 채팅방 메시지 조회
  getChatRoomMessages: async (roomId: number): Promise<Message[]> => {
    return await api
      .get<Message[]>(`/chat/room/${roomId}/messages`)
      .then((res) => res.data);
  },

  // 메시지 전송 (WebSocket 사용 시 필요 없을 수 있음)
  sendMessage: async (roomId: number, content: string): Promise<Message> => {
    return await api
      .post<Message>(`/chat/room/${roomId}/messages`, { content })
      .then((res) => res.data);
  },
};
