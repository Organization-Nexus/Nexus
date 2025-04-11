import {
  CreateCommunityForm,
  UpdateCommunityForm,
  Notice,
  Vote,
  VoteOption,
  CreateVoteDto,
  Feed,
} from "@/types/community";
import api from "../axios";

export const communityApi = {
  getfeedsByProjectId: async (projectId: string): Promise<Feed[]> => {
    return await api
      .get<Feed[]>(`/community/feeds/${projectId}`)
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

  getVoteOptionByVoteIdAndProjectId: async (
    voteId: string,
    projectId: string
  ): Promise<VoteOption[]> => {
    return await api
      .get(`/vote/vote-options/${voteId}/${projectId}`)
      .then((res) => res.data);
  },

  createVoteByProjectId: async (
    projectId: string,
    data: CreateVoteDto | FormData
  ) => {
    const isFormData = data instanceof FormData;
    return await api.post(`/vote/create-vote/${projectId}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },

  deleteFeedByFeedIdAndProjectId: async (feedId: string, projectId: string) => {
    return await api.delete(`/feed/delete-feed/${feedId}/${projectId}`);
  },

  deleteVoteByVoteIdAndProjectId: async (voteId: string, projectId: string) => {
    return await api.delete(`/vote/delete-vote/${voteId}/${projectId}`);
  },

  getMyFeedList: async (projectId: string) => {
    return await api.get(`/feed/myfeeds/${projectId}`).then((res) => res.data);
  },

  getMyNoticeList: async (projectId: string) => {
    return await api
      .get(`/feed/mynotices/${projectId}`)
      .then((res) => res.data);
  },

  getMyVoteList: async (projectId: string) => {
    return await api.get(`/vote/myvotes/${projectId}`).then((res) => res.data);
  },

  getFeedById: async (feedId: string, projectId: string): Promise<Feed> => {
    return await api
      .get<Feed>(`/feed/${feedId}/${projectId}`)
      .then((res) => res.data);
  },

  getNoticeById: async (
    noticeId: string,
    projectId: string
  ): Promise<Notice> => {
    return await api
      .get<Notice>(`/feed/${noticeId}/${projectId}`)
      .then((res) => res.data);
  },

  getVoteById: async (voteId: string, projectId: string): Promise<Vote> => {
    return await api
      .get<Vote>(`/vote/${voteId}/${projectId}`)
      .then((res) => res.data);
  },
};
