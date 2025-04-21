import { InviteProjectUserDto, ProjectUser } from "@/types/project-user";
import { api } from "../axios";

export const projectUserApi = {
  getProjectUsers: async (projectId: string): Promise<ProjectUser[]> => {
    return await api
      .get<ProjectUser[]>(`/project-user/get-project-users/${projectId}`)
      .then((res) => res.data);
  },

  getProjectUser: async (projectId: string): Promise<ProjectUser> => {
    return await api
      .get<ProjectUser>(`/project-user/get-project-user/${projectId}`)
      .then((res) => res.data);
  },

  inviteProjectUser: async (
    projectId: string,
    data: InviteProjectUserDto
  ): Promise<{ message: string; projectUser: ProjectUser }> => {
    return await api
      .post(`/project-user/invite/${projectId}`, data)
      .then((res) => res.data);
  },
};
