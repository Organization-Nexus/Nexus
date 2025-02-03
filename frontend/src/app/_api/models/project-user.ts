import { ProjectUser } from "@/types/project-user";
import { api } from "../axios";

export const projectUserApi = {
  getProjectUser: async (projectId: string): Promise<ProjectUser[]> => {
    return await api
      .get<ProjectUser[]>(`/project-user/get-project-users/${projectId}`)
      .then((res) => res.data);
  },
};
