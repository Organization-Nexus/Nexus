import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/api/project";
import { projectKeys } from "./key";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.PROJECT_LIST_KEY });
    },
    onError: (error) => {
      console.error("프로젝트 생성 실패", error);
    },
  });
};
