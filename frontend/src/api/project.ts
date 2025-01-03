import { CreateProject, Project } from "@/types/project";
import api from "./config/axios";

export const projectApi = {
  getMyProjects: async (): Promise<Project[]> => {
    return await api
      .get<Project[]>("/project/my-projects")
      .then((res) => res.data);
  },

  createProject: async (data: CreateProject) => {
    return await api.post("/project/create-project", data);
  },
};
