import { commentApi } from "@/app/_api/models/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "../key";
import {
  CreateFeedCommentRequest,
  CreateVoteCommentRequest,
} from "@/types/comment";

export const useCreateFeedOrNoticeComment = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentData: CreateFeedCommentRequest) =>
      commentApi.createFeedOrNoticeComment(projectId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.FEED_OR_NOTICE_COMMENT_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("댓글 생성 실패", error);
    },
  });
};

export const useCreateVoteComment = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentData: CreateVoteCommentRequest) =>
      commentApi.createVoteComment(projectId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.VOTE_COMMENT_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("댓글 생성 실패", error);
    },
  });
};

export const useDeleteComment = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      commentType,
    }: {
      commentId: number;
      commentType: "vote" | "feed" | "notice";
    }) => {
      return commentApi.deleteCommentByCommentIdAndProjectId(
        commentId,
        projectId
      );
    },
    onSuccess: (data, variables) => {
      const { commentType } = variables;
      if (commentType === "vote") {
        queryClient.refetchQueries({
          queryKey: commentKeys.VOTE_COMMENT_LIST_KEY,
        });
      } else if (commentType === "feed" || commentType === "notice") {
        queryClient.refetchQueries({
          queryKey: commentKeys.FEED_OR_NOTICE_COMMENT_LIST_KEY,
        });
      }
    },
    onError: (error) => {
      console.error("댓글 삭제 실패", error);
    },
  });
};
