import api from "../axios";

export const likeApi = {
  feedLike: async (feedId: string, projectId: string) => {
    return await api.put(`/like/feed/${feedId}/${projectId}`);
  },

  voteLike: async (voteId: string, projectId: string) => {
    return await api.put(`/like/vote/${voteId}/${projectId}`);
  },

  getFeedLikes: async (feedId: string, projectId: string) => {
    return await api.get(`/like/feed/${feedId}/${projectId}`);
  },

  getVoteLikes: async (voteId: string, projectId: string) => {
    return await api.get(`/like/vote/${voteId}/${projectId}`);
  },
};
