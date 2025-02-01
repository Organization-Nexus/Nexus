import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/api/project";
import { Project } from "@/types/project";
import { projectKeys } from "../key";

// 프로젝트 목록 가져오기
export const useProjectList = (initialData: Project[]) => {
  return useQuery({
    queryKey: projectKeys.PROJECT_LIST_KEY,
    queryFn: projectApi.getMyProjects,
    initialData,
    initialDataUpdatedAt: Date.now(),
  });
};
