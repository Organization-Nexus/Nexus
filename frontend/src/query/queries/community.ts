import { Community, Notice } from "@/types/community";
import { communityKeys } from "../key";
import { communityApi } from "@/app/_api/models/community";
import { useQuery } from "@tanstack/react-query";

// 공지사항 목록 가져오기
export const useNoticeList = (projectId: string, initialData: Notice[]) => {
  return useQuery({
    queryKey: communityKeys.NOTICE_LIST_KEY,
    queryFn: () => communityApi.getNoticesByProjectId(projectId),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });
};

// 피드 목록 가져오기
export const useFeedList = (projectId: string, initialData: Community[]) => {
  return useQuery({
    queryKey: communityKeys.FEED_LIST_KEY,
    queryFn: () => communityApi.getfeedsByProjectId(projectId),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });
};
