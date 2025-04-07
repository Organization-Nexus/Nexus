export const projectKeys = {
  PROJECT_LIST_KEY: ["projectList"],
};

export const projectUserKeys = {
  PROJECT_USER_INFO_KEY: ["projectUser"],
};

export const communityKeys = {
  NOTICE_LIST_KEY: ["noticeList"],
  FEED_LIST_KEY: ["feedList"],
  VOTE_LIST_KEY: ["voteList"],
  MY_FEED_LIST_KEY: (projectId: string) => ["myFeedList", projectId],
  MY_NOTICE_LIST_KEY: (projectId: string) => ["myNoticeList", projectId],
  MY_VOTE_LIST_KEY: (projectId: string) => ["myVoteList", projectId],
};

export const commentKeys = {
  FEED_OR_NOTICE_COMMENT_LIST_KEY: ["feedOrNoticeCommentList"],
  VOTE_COMMENT_LIST_KEY: ["voteCommentList"],
};

export const minutesKeys = {
  MINUTES_LIST_KEY: ["minutesList"],
  MINUTES_DETAIL_KEY: (projectId: number, minutesId: number) => [
    "minutesList",
    projectId,
    minutesId,
  ],
};

export const milestoneKeys = {
  MILESTONE_LIST_KEY: ["milestone"],
  MILESTONE_DETAIL_KEY: (projectId: number, milestoneId: number) => [
    "milestone",
    projectId,
    milestoneId,
  ],
};

export const issueKeys = {
  ISSUE_LIST_KEY: (projectId: number, milestoneId: number) => [
    "issues",
    projectId,
    milestoneId,
  ],
  ISSUE_DETAIL_KEY: (
    projectId: number,
    milestoneId: number,
    issueId: number
  ) => ["issue", projectId, milestoneId, issueId],
};

export const userKeys = {
  MYPAGE_USER_INFO_KEY: ["myPageUserInfo"],
};
