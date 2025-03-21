import { useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneKeys } from "../key";
import { UpdateMinutes } from "@/types/minutes";
import { CreateMilestone } from "@/types/milestone";
import { milestoneApi } from "@/app/_api/models/milestone";

// 마일스톤 생성
export const useCreateMilestone = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (milestoneData: CreateMilestone) => {
      return milestoneApi.createMilestoneByProjectId(projectId, milestoneData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.MILESTONE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("마일스톤 생성 실패", error);
    },
  });
};

// 마일스톤 수정
export const useUpdateMilestone = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      milestoneId,
      data,
    }: {
      milestoneId: number;
      data: UpdateMinutes;
    }) =>
      milestoneApi.updateMilestoneByMilestoneId(projectId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.MILESTONE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("마일스톤 수정 실패", error);
    },
  });
};

// 마일스톤 삭제
export const useDeleteMilestone = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId: number) =>
      milestoneApi.deleteMilestoneByMilestoneId(projectId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.MILESTONE_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("마일스톤 삭제 실패", error);
    },
  });
};
