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
export const useUpdateCommunity = (projectId: string, feedId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityData: FormData) =>
      communityApi.updateCommunityByFeedIdAndProjectId(
        feedId,
        projectId,
        communityData
      ),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: communityKeys.NOTICE_LIST_KEY,
      });
    },
    onError: (error: any) => {
      console.error("공지사항 수정 실패", error.response?.data || error);
      alert(`서버 에러: ${JSON.stringify(error.response?.data)}`);
    },
  });
};
