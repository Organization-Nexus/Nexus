import { useQuery } from "@tanstack/react-query";
import { commentKeys } from "../key";
import { commentApi } from "@/app/_api/models/comment";

export const useFeedOrNoticeList = (feedId: string) => {
  return useQuery({
    queryKey: commentKeys.FEED_OR_NOTICE_COMMENT_LIST_KEY,
    queryFn: () => commentApi.getCommentsByFeedId(feedId),
  });
};

export const useVoteCommentList = (voteId: string) => {
  return useQuery({
    queryKey: commentKeys.VOTE_COMMENT_LIST_KEY,
    queryFn: () => commentApi.getCommentsByVoteId(voteId),
  });
};
