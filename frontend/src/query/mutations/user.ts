import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "../key";
import { userApi } from "@/app/_api/models/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateUserData: FormData) =>
      userApi.updateUser(updateUserData),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: userKeys.MYPAGE_USER_INFO_KEY,
      });
    },
    onError: (error) => {
      console.error("유저 정보 수정 실패", error);
    },
  });
};
