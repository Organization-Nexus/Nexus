export const projectKeys = {
  PROJECT_LIST_KEY: ["projectList"],
  PROJECT_DETAIL_KEY: (projectId: string) => ["projectDetail", projectId],
};

export const projectUserKeys = {
  PROJECT_USER_INFO_KEY: ["projectUser"],
  PROJECT_USER_KEY: (projectId: string) => ["projectUser", projectId],
};

export const communityKeys = {
  NOTICE_LIST_KEY: ["noticeList"],
  FEED_LIST_KEY: ["feedList"],
  VOTE_LIST_KEY: ["voteList"],
  FEED_DETAIL_KEY: (projectId: string, feedId: string) => [
    "feedDetail",
    feedId,
    projectId,
  ],
  NOTICE_DETAIL_KEY: (projectId: string, noticeId: string) => [
    "noticeDetail",
    noticeId,
    projectId,
  ],
  VOTE_DETAIL_KEY: (projectId: string, voteId: string) => [
    "voteDetail",
    voteId,
    projectId,
  ],
  MY_FEED_LIST_KEY: (projectId: string) => ["myFeedList", projectId],
  MY_NOTICE_LIST_KEY: (projectId: string) => ["myNoticeList", projectId],
  MY_VOTE_LIST_KEY: (projectId: string) => ["myVoteList", projectId],
};

export const commentKeys = {
  FEED_OR_NOTICE_COMMENT_LIST_KEY: ["feedOrNoticeCommentList"],
  VOTE_COMMENT_LIST_KEY: ["voteCommentList"],
  FEED_OR_NOTICE_COMMENT_KEY: ["feedOrNoticeComment"],
};

export const minutesKeys = {
  MINUTES_LIST_KEY: ["minutesList"],
  MY_MINUTES_LIST_KEY: (projectId: number) => ["myMinutesList", projectId],
  MINUTES_DETAIL_KEY: (projectId: number, minutesId: number) => [
    "minutesList",
    projectId,
    minutesId,
  ],
};

export const milestoneKeys = {
  MILESTONE_LIST_KEY: ["milestone"],
  MY_MILESTONE_LIST_KEY: (projectId: number) => ["myMilestone", projectId],
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
  MY_ISSUE_LIST_KEY: (projectId: number) => ["myIssues", projectId],
  ISSUE_DETAIL_KEY: (
    projectId: number,
    milestoneId: number,
    issueId: number
  ) => ["issue", projectId, milestoneId, issueId],
};

export const userKeys = {
  MYPAGE_USER_INFO_KEY: ["myPageUserInfo"],
};
