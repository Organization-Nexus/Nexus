import { useMutation, useQueryClient } from "@tanstack/react-query";
import { minutesKeys } from "../key";
import { minutesApi } from "@/app/_api/models/minutes";
import { CreateMinutes, UpdateMinutes } from "@/types/minutes";

// 회의록 생성
export const useCreateMinutes = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (minutesData: CreateMinutes) => {
      return minutesApi.createMinutesByProjectId(projectId, minutesData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: minutesKeys.MINUTES_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("회의록 생성 실패", error);
    },
  });
};

// 회의록 수정
export const useUpdateMinutes = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      minutesId,
      data,
    }: {
      minutesId: number;
      data: UpdateMinutes;
    }) => minutesApi.UpdateMinutesByMinutesId(projectId, minutesId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: minutesKeys.MINUTES_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("회의록 수정 실패", error);
    },
  });
};

// 회의록 삭제
export const useDeleteMinutes = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (minutesId: number) =>
      minutesApi.deleteMinutesByMinutesId(projectId, minutesId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: minutesKeys.MINUTES_LIST_KEY,
      });
    },
    onError: (error) => {
      console.error("회의록 삭제 실패", error);
    },
  });
};
