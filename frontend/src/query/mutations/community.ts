import { communityApi } from "@/app/_api/models/community";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityKeys } from "../key";

// 공지사항 생성
export const useCreateNotice = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noticeData: FormData) => {
      return communityApi.createNoticeByProjectId(projectId, noticeData);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: communityKeys.NOTICE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("공지사항 생성 실패", error);
    },
  });
};

// 피드 생성
export const useCreateFeed = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedData: FormData) =>
      communityApi.createFeedByProjectId(projectId, feedData),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: communityKeys.FEED_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("피드 생성 실패", error);
    },
  });
};

// 커뮤니티 수정
export const useUpdateCommunity = (
  projectId: string,
  feedId: string,
  type: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityData: FormData) =>
      communityApi.updateCommunityByFeedIdAndProjectId(
        feedId,
        projectId,
        communityData
      ),
    onSuccess: () => {
      if (type === "notice") {
        queryClient.refetchQueries({
          queryKey: communityKeys.NOTICE_LIST_KEY,
        });
      } else if (type === "feed") {
        queryClient.refetchQueries({
          queryKey: communityKeys.FEED_LIST_KEY,
        });
      }
    },
  });
};

// 투표 생성
export const useCreateVote = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voteData: FormData) =>
      communityApi.createVoteByProjectId(projectId, voteData),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: communityKeys.VOTE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("투표 생성 실패", error);
    },
  });
};

// 투표 해버리기
export const useCreateVoteResponse = (voteId: string, projectId: string) => {
  return useMutation({
    mutationFn: (optionId: number[]) =>
      communityApi.createVoteResponseByVoteIdAndProjectId(
        voteId,
        projectId,
        optionId
      ),
  });
};

// 피드, 공지사항 삭제
export const useDeleteFeed = (projectId: string, type: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: string) =>
      communityApi.deleteFeedByFeedIdAndProjectId(feedId, projectId),
    onSuccess: () => {
      if (type === "notice") {
        queryClient.refetchQueries({
          queryKey: communityKeys.NOTICE_LIST_KEY,
        });
      } else if (type === "feed") {
        queryClient.refetchQueries({
          queryKey: communityKeys.FEED_LIST_KEY,
        });
      }
    },
  });
};

// 투표 삭제
export const useDeleteVote = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voteId: string) =>
      communityApi.deleteVoteByVoteIdAndProjectId(voteId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.VOTE_LIST_KEY,
      });
    },
  });
};
