import { CreateProject, Project, UpdateProject } from "@/types/project";
import api from "../axios";

export const projectApi = {
  getMyProjects: async (): Promise<Project[]> => {
    return await api
      .get<Project[]>("/project/my-projects")
      .then((res) => res.data);
  },

  createProject: async (data: CreateProject | FormData) => {
    const isFormData = data instanceof FormData;
    return await api.post("/project/create-project", data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  updateProject: async (projectId: string, data: UpdateProject | FormData) => {
    const isFormData = data instanceof FormData;
    return await api.patch(`/project/update-project/${projectId}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  deleteProject: async (projectId: string) => {
    return await api.delete(`/project/delete-project/${projectId}`);
  },

  getProjectById: async (userId: string): Promise<Project> => {
    return await api
      .get<Project>(`/project/detail/${userId}`)
      .then((res) => res.data);
  },

  getMilestonesByProjectIds: async (projectIds: string): Promise<any> => {
    return await api
      .get<any>(`/project/milestones/${projectIds}`)
      .then((res) => res.data);
  },
};
