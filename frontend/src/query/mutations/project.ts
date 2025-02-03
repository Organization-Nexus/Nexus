import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "../key";
import { Project } from "@/types/project";
import { projectApi } from "@/app/_api/models/project";

// 프로젝트 생성 후 목록 다시 불러오기
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectData: Project) => projectApi.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.PROJECT_LIST_KEY });
    },
    onError: (error) => {
      console.error("프로젝트 생성 실패", error);
    },
  });
};
