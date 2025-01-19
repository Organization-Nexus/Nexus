import { ProjectUser } from "@/types/project";
import { api } from "./config/axios";

export const projectUserApi = {
  getProjectUser: async (projectId: string): Promise<ProjectUser[]> => {
    return await api
      .get<ProjectUser[]>(`/project-user/get-project-users/${projectId}`)
      .then((res) => res.data);
  },
};
