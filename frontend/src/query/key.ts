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

export const userKeys = {
  MYPAGE_USER_INFO_KEY: ["myPageUserInfo"],
};
