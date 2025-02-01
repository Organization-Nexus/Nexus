import { communityApi } from "@/api/community";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityKeys } from "../key";
import { Community, Notice } from "@/types/community";

// 공지사항 생성 후 목록 다시 불러오기
export const useCreateNotice = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noticeData: Notice) =>
      communityApi.createNoticeByProjectId(projectId, noticeData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.NOTICE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("공지사항 생성 실패", error);
    },
  });
};

// 피드 생성 후 목록 다시 불러오기
export const useCreateFeed = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedData: Community) =>
      communityApi.createFeedByProjectId(projectId, feedData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.FEED_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("피드 생성 실패", error);
    },
  });
};
