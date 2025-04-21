import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "../key";
import { projectApi } from "@/app/_api/models/project";

// 프로젝트 생성 후 목록 다시 불러오기
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectData: FormData) =>
      projectApi.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.PROJECT_LIST_KEY });
    },
    onError: (error) => {
      console.error("프로젝트 생성 실패", error);
    },
  });
};

// 프로젝트 수정
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      projectData,
    }: {
      projectId: string;
      projectData: FormData;
    }) => projectApi.updateProject(projectId, projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.PROJECT_LIST_KEY });
    },
    onError: (error) => {
      console.error("프로젝트 수정 실패", error);
    },
  });
};

// 프로젝트 삭제
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.PROJECT_LIST_KEY });
    },
    onError: (error) => {
      console.error("프로젝트 삭제 실패", error);
    },
  });
};
