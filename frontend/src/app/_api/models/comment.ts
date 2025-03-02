import {
  CommentResponse,
  CreateFeedCommentRequest,
  CreateVoteCommentRequest,
} from "@/types/comment";
import api from "../axios";

export const commentApi = {
  createFeedOrNoticeComment: async (
    projectId: string,
    data: CreateFeedCommentRequest
  ): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>(
      `/comment/feed/${projectId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  createVoteComment: async (
    projectId: string,
    data: CreateVoteCommentRequest
  ): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>(
      `/comment/vote/${projectId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  getCommentsByFeedId: async (feedId: string): Promise<CommentResponse[]> => {
    const response = await api.get<CommentResponse[]>(
      `/comment/feed/${feedId}`
    );
    return response.data;
  },

  getCommentsByVoteId: async (voteId: string): Promise<CommentResponse[]> => {
    const response = await api.get<CommentResponse[]>(
      `/comment/vote/${voteId}`
    );
    return response.data;
  },

  deleteCommentByCommentIdAndProjectId: async (
    commentId: number,
    projectId: string
  ) => {
    await api.delete(`/comment/${commentId}/${projectId}`);
  },
};
