import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/app/_api/models/project";
import { milestoneKeys, projectKeys } from "../key";
import { Project } from "@/types/project";

// 프로젝트 목록 가져오기
export const useProjectList = (initialData: Project[] = [], enabled = true) => {
  return useQuery({
    queryKey: projectKeys.PROJECT_LIST_KEY,
    queryFn: projectApi.getMyProjects,
    initialData,
    enabled,
  });
};

// 특정 프로젝트 상세 정보 가져오기
export const useProjectDetail = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: projectKeys.PROJECT_DETAIL_KEY(projectId),
    queryFn: () => projectApi.getProjectById(projectId),
    enabled,
  });
};

// 마일스톤 목록 가져오기
export const useMilestonesByProjectIds = (
  projectIds: string,
  enabled = true
) => {
  return useQuery({
    queryKey: milestoneKeys.MILESTONE_LIST_KEY.concat(projectIds),
    queryFn: () => projectApi.getMilestonesByProjectIds(projectIds),
    enabled,
  });
};
