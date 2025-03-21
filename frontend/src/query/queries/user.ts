import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../key";
import { userApi } from "@/app/_api/models/user";

// 유저 정보 가져오기
export const useUserInfo = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: userKeys.MYPAGE_USER_INFO_KEY,
    queryFn: userApi.getUser,
    ...options,
  });
};
