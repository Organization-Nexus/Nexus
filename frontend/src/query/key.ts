export const projectKeys = {
  PROJECT_LIST_KEY: ["projectList"],
};

export const communityKeys = {
  NOTICE_LIST_KEY: ["noticeList"],
  FEED_LIST_KEY: ["feedList"],
  VOTE_LIST_KEY: ["voteList"],
  VOTE_OPTION_RESPONSES_KEY: ["voteOptionResponses"],
};

export const minutesKeys = {
  MINUTES_LIST_KEY: ["minutesList"],
  MINUTES_DETAIL_KEY: (projectId: number, minutesId: number) => [
    "minutesList",
    projectId,
    minutesId,
  ],
};

export const userKeys = {
  MYPAGE_USER_INFO_KEY: ["myPageUserInfo"],
};
