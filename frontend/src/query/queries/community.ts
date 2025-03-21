import { communityKeys } from "../key";
import { communityApi } from "@/app/_api/models/community";
import { useQuery } from "@tanstack/react-query";

// 공지사항 목록 가져오기
export const useNoticeList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.NOTICE_LIST_KEY,
    queryFn: () => communityApi.getNoticesByProjectId(projectId),
  });
};

// 피드 목록 가져오기
export const useFeedList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.FEED_LIST_KEY,
    queryFn: () => communityApi.getfeedsByProjectId(projectId),
  });
};

// 투표 목록 가져오기
export const useVoteList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.VOTE_LIST_KEY,
    queryFn: () => communityApi.getVotesByProjectId(projectId),
  });
};
