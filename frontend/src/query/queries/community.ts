import { communityKeys } from "../key";
import { communityApi } from "@/app/_api/models/community";
import { useQuery } from "@tanstack/react-query";

// 피드 상세 조회
export const useFeedDetail = (projectId: string, feedId: string) => {
  return useQuery({
    queryKey: communityKeys.FEED_DETAIL_KEY(feedId, projectId),
    queryFn: () => communityApi.getFeedById(feedId, projectId),
  });
};

// 공지사항 상세 조회
export const useNoticeDetail = (projectId: string, noticeId: string) => {
  return useQuery({
    queryKey: communityKeys.NOTICE_DETAIL_KEY(noticeId, projectId),
    queryFn: () => communityApi.getNoticeById(noticeId, projectId),
  });
};

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

// 본인 피드 목록 가져오기
export const useMyFeedList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.MY_FEED_LIST_KEY(projectId),
    queryFn: () => communityApi.getMyFeedList(projectId),
  });
};
// 본인 공지사항 목록 가져오기
export const useMyNoticeList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.MY_NOTICE_LIST_KEY(projectId),
    queryFn: () => communityApi.getMyNoticeList(projectId),
  });
};
// 본인 투표 목록 가져오기
export const useMyVoteList = (projectId: string) => {
  return useQuery({
    queryKey: communityKeys.MY_VOTE_LIST_KEY(projectId),
    queryFn: () => communityApi.getMyVoteList(projectId),
  });
};
