import { projectUserApi } from "@/app/_api/models/project-user";
import { InviteProjectUserDto } from "@/types/project-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectUserKeys } from "../key";

export const useInviteProjectUser = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteProjectUserDto) =>
      projectUserApi.inviteProjectUser(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectUserKeys.PROJECT_USER_INFO_KEY,
      });
    },
    onError: (error) => {
      console.error("유저 추가 실패", error);
    },
  });
};
