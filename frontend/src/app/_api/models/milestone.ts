import { CreateMilestone, Milestone, UpdateMilestone } from "@/types/milestone";
import api from "../axios";

export const milestoneApi = {
  createMilestoneByProjectId: async (
    projectId: number,
    data: CreateMilestone
  ) => {
    return await api.post(`/projects/${projectId}/milestones/`, data);
  },

  getMilestonesByProjectId: async (projectId: number): Promise<Milestone[]> => {
    return await api
      .get<Milestone[]>(`/projects/${projectId}/milestones/`)
      .then((res) => res.data);
  },

  getMilestoneByMilestoneId: async (
    projectId: number,
    milestoneId: number
  ): Promise<Milestone> => {
    return await api
      .get<Milestone>(`/projects/${projectId}/milestones/${milestoneId}/`)
      .then((res) => res.data);
  },

  updateMilestoneByMilestoneId: async (
    projectId: number,
    milestoneId: number,
    data: UpdateMilestone
  ) => {
    return await api.patch(
      `/projects/${projectId}/milestones/${milestoneId}/`,
      data
    );
  },

  deleteMilestoneByMilestoneId: async (
    projectId: number,
    milestoneId: number
  ) => {
    return await api.delete(
      `/projects/${projectId}/milestones/${milestoneId}/`
    );
  },
};
