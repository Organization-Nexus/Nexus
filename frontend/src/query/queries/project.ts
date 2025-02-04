import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/app/_api/models/project";
import { projectKeys } from "../key";

// 프로젝트 목록 가져오기
export const useProjectList = () => {
  return useQuery({
    queryKey: projectKeys.PROJECT_LIST_KEY,
    queryFn: projectApi.getMyProjects,
  });
};
