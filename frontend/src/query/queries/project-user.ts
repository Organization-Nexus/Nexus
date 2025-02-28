import { projectUserKeys } from "../key";
import { useQuery } from "@tanstack/react-query";
import { projectUserApi } from "@/app/_api/models/project-user";

// 프로젝트 유저 정보(본인)
export const useProjectUserInfo = (projectId: string) => {
  return useQuery({
    queryKey: projectUserKeys.PROJECT_USER_INFO_KEY,
    queryFn: () => projectUserApi.getProjectUser(projectId),
  });
};

// 프로젝트 유저 목록
export const useProjectUsersInfo = (projectId: string) => {
  return useQuery({
    queryKey: projectUserKeys.PROJECT_USER_INFO_KEY,
    queryFn: () => projectUserApi.getProjectUsers(projectId),
  });
};
