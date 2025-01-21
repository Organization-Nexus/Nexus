import { Community, Notice } from "@/types/community";
import api from "./config/axios";

export const communityApi = {
  getfeedsByProjectId: async (projectId: string): Promise<Community[]> => {
    return await api
      .get<Community[]>(`/community/feeds/${projectId}`)
      .then((res) => res.data);
  },

  getNoticesByProjectId: async (projectId: string): Promise<Notice[]> => {
    return await api
      .get<Notice[]>(`/community/notices/${projectId}`)
      .then((res) => res.data);
  },
};
