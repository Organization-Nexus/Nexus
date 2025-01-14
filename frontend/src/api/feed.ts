import { Feed } from "@/types/feed";
import api from "./config/axios";

export const feedApi = {
  getfeedsByProjectId: async (id: string): Promise<Feed[]> => {
    return await api
      .get<Feed[]>(`/community/feeds/${id}`)
      .then((res) => res.data);
  },
};
