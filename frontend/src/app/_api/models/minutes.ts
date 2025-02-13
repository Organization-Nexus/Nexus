import api from "../axios";
import { CreateMinutes, Minutes, UpdateMinutes } from "@/types/minutes";
export const minutesApi = {
  createMinutesByProjectId: async (projectId: string, data: CreateMinutes) => {
    return await api.post(`/projects/${projectId}/minutes/`, data);
  },

  getMinutesByProjectId: async (projectId: string): Promise<Minutes[]> => {
    return await api
      .get<Minutes[]>(`/projects/${projectId}/minutes/`)
      .then((res) => res.data);
  },
  getMinutesByMinutesId: async (
    projectId: string,
    minutesId: string
  ): Promise<Minutes> => {
    return await api
      .get<Minutes>(`/projects/${projectId}/minutes/${minutesId}/`)
      .then((res) => res.data);
  },

  UpdateMinutesByMinutesId: async (
    projectId: string,
    minutesId: string,
    data: UpdateMinutes
  ) => {
    return await api.patch(
      `/projects/${projectId}/minutes/${minutesId}/`,
      data
    );
  },

  deleteMinutesByMinutesId: async (projectId: string, minutesId: string) => {
    return await api.delete(`/projects/${projectId}/minutes/${minutesId}/`);
  },
};
