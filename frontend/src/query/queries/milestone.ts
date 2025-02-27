import { useQuery } from "@tanstack/react-query";
import { milestoneKeys } from "../key";
import { milestoneApi } from "@/app/_api/models/milestone";

export const useMilestoneList = (projectId: number) => {
  return useQuery({
    queryKey: milestoneKeys.MILESTONE_LIST_KEY,
    queryFn: () => milestoneApi.getMilestonesByProjectId(projectId),
  });
};

export const useMilestoneDetail = (projectId: number, milestoneId: number) => {
  return useQuery({
    queryKey: milestoneKeys.MILESTONE_DETAIL_KEY(projectId, milestoneId),
    queryFn: () =>
      milestoneApi.getMilestoneByMilestoneId(projectId, milestoneId),
  });
};
