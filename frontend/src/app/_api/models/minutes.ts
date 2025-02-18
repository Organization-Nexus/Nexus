import api from "../axios";
import { CreateMinutes, Minutes, UpdateMinutes } from "@/types/minutes";
export const minutesApi = {
  createMinutesByProjectId: async (projectId: string, data: CreateMinutes) => {
    return await api.post(`/projects/${projectId}/minutes/`, data);
  },

  getMinutesByProjectId: async (projectId: number): Promise<Minutes[]> => {
    return await api
      .get<Minutes[]>(`/projects/${projectId}/minutes/`)
      .then((res) => res.data);
  },
  getMinutesByMinutesId: async (
    projectId: number,
    minutesId: number
  ): Promise<Minutes> => {
    return await api
      .get<Minutes>(`/projects/${projectId}/minutes/${minutesId}/`)
      .then((res) => res.data);
  },

  UpdateMinutesByMinutesId: async (
    projectId: number,
    minutesId: number,
    data: UpdateMinutes
  ) => {
    return await api.patch(
      `/projects/${projectId}/minutes/${minutesId}/`,
      data
    );
  },

  deleteMinutesByMinutesId: async (projectId: number, minutesId: number) => {
    return await api.delete(`/projects/${projectId}/minutes/${minutesId}/`);
  },
};
