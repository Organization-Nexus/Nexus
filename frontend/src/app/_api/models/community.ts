import {
  Community,
  CreateCommunityForm,
  UpdateCommunityForm,
  Notice,
  Vote,
  VoteOption,
} from "@/types/community";
import api from "../axios";

export const communityApi = {
  getfeedsByProjectId: async (projectId: string): Promise<Community[]> => {
    return await api
      .get<Community[]>(`/community/feeds/${projectId}`)
      .then((res) => res.data);
  },

  getNoticesByProjectId: async (projectId: string): Promise<Notice[]> => {
    return await api
      .get<Notice[]>(`/community/notices/${projectId}`)
      .then((res) => res.data);
  },

  createFeedByProjectId: async (
    projectId: string,
    data: CreateCommunityForm | FormData
  ) => {
    const isFormData = data instanceof FormData;
    return await api.post(`/feed/create-feed/${projectId}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  createNoticeByProjectId: async (
    projectId: string,
    data: CreateCommunityForm | FormData
  ) => {
    const isFormData = data instanceof FormData;
    return await api.post(`/feed/create-notice/${projectId}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  updateCommunityByFeedIdAndProjectId: async (
    feedId: string,
    projectId: string,
    data: UpdateCommunityForm | FormData
  ) => {
    const isFormData = data instanceof FormData;
    return await api.patch(`/feed/update-feed/${feedId}/${projectId}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  getVotesByProjectId: async (projectId: string): Promise<Vote[]> => {
    return await api
      .get<Vote[]>(`/community/votes/${projectId}`)
      .then((res) => res.data);
  },

  createVoteResponseByVoteIdAndProjectId: async (
    voteId: string,
    projectId: string,
    optionId: number[]
  ) => {
    return await api.patch(
      `/vote/vote-response/${voteId}/${projectId}`,
      { optionId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  getVoteOptionsByVoteIdAndProjectId: async (
    voteId: string,
    projectId: string
  ): Promise<VoteOption[]> => {
    return await api
      .get(`/vote/vote-options/${voteId}/${projectId}`)
      .then((res) => res.data);
  },
};
