import { useQuery } from "@tanstack/react-query";

import { issueKeys } from "../key";
import { issueApi } from "@/app/_api/models/issue";

export function useIssueList(projectId: number, milestoneId: number) {
  return useQuery({
    queryKey: issueKeys.ISSUE_LIST_KEY(projectId, milestoneId),
    queryFn: () => issueApi.getIssuesByMilestoneId(projectId, milestoneId),
    select: (data) => {
      return [...data].sort((a, b) => a.id - b.id);
    },
  });
}

export const useIssueDetail = (
  projectId: number,
  milestoneId: number,
  issueId: number
) => {
  return useQuery({
    queryKey: issueKeys.ISSUE_DETAIL_KEY(projectId, milestoneId, issueId),
    queryFn: () => issueApi.getIssueByIssueId(projectId, milestoneId, issueId),
  });
};
