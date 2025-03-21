import { CreateIssue, Issue, UpdateIssue } from "@/types/issue";
import api from "../axios";

export const issueApi = {
  createIssueByMilestoneId: async (
    projectId: number,
    milestoneId: number,
    data: CreateIssue
  ) => {
    return await api.post(
      `/projects/${projectId}/milestones/${milestoneId}/issues`,
      data
    );
  },

  getIssuesByMilestoneId: async (
    projectId: number,
    milestoneId: number
  ): Promise<Issue[]> => {
    return await api
      .get<Issue[]>(`/projects/${projectId}/milestones/${milestoneId}/issues`)
      .then((res) => res.data);
  },

  getIssueByIssueId: async (
    projectId: number,
    milestoneId: number,
    issueId: number
  ): Promise<Issue> => {
    return await api
      .get<Issue>(
        `/projects/${projectId}/milestones/${milestoneId}/issues/${issueId}/`
      )
      .then((res) => res.data);
  },

  updateIssueByIssueId: async (
    projectId: number,
    milestoneId: number,
    issueId: number,
    data: UpdateIssue
  ) => {
    return await api.patch(
      `/projects/${projectId}/milestones/${milestoneId}/issues/${issueId}/`,
      data
    );
  },

  deleteIssueByIssueId: async (
    projectId: number,
    milestoneId: number,
    issueId: number
  ) => {
    return await api.delete(
      `/projects/${projectId}/milestones/${milestoneId}/issues/${issueId}/`
    );
  },
};
