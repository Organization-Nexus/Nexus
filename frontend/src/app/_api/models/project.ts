import { CreateProject, Project } from "@/types/project";
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

  getProjectById: async (userId: string): Promise<Project> => {
    return await api
      .get<Project>(`/project/detail/${userId}`)
      .then((res) => res.data);
  },
};
