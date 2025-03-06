import { useMutation, useQueryClient } from "@tanstack/react-query";
import { issueKeys } from "../key";
import { issueApi } from "@/app/_api/models/issue";
import { CreateIssue, UpdateIssue } from "@/types/issue";

// 이슈 생성
export const useCreateIssue = (projectId: number, milestoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (issueData: CreateIssue) => {
      return issueApi.createIssueByMilestoneId(
        projectId,
        milestoneId,
        issueData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.ISSUE_LIST_KEY(projectId, milestoneId),
      });
    },
    onError: (error) => {
      console.error("이슈 생성 실패", error);
    },
  });
};

// 이슈 수정
export const useUpdateIssue = (projectId: number, milestoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, data }: { issueId: number; data: UpdateIssue }) =>
      issueApi.updateIssueByIssueId(projectId, milestoneId, issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.ISSUE_LIST_KEY(projectId, milestoneId),
      });
    },
    onError: (error) => {
      console.error("이슈 수정 실패", error);
    },
  });
};

// 이슈 삭제
export const useDeleteIssue = (projectId: number, milestoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (issueId: number) =>
      issueApi.deleteIssueByIssueId(projectId, milestoneId, issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.ISSUE_LIST_KEY(projectId, milestoneId),
      });
    },
    onError: (error) => {
      console.error("이슈 삭제 실패", error);
    },
  });
};
