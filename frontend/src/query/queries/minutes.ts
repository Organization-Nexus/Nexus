import { minutesKeys } from "../key";
import { useQuery } from "@tanstack/react-query";
import { minutesApi } from "@/app/_api/models/minutes";

// 회의록 목록 가져오기
export const useMinutesList = (projectId: number) => {
  return useQuery({
    queryKey: minutesKeys.MINUTES_LIST_KEY,
    queryFn: () => minutesApi.getMinutesByProjectId(projectId),
  });
};

export const useMyMinutesList = (projectId: number) => {
  return useQuery({
    queryKey: minutesKeys.MY_MINUTES_LIST_KEY(projectId),
    queryFn: () => minutesApi.getMyMinutesList(projectId),
  });
};

export const useMinutesDetail = (projectId: number, minutesId: number) => {
  return useQuery({
    queryKey: minutesKeys.MINUTES_DETAIL_KEY(projectId, minutesId),
    queryFn: () => minutesApi.getMinutesByMinutesId(projectId, minutesId),
  });
};
