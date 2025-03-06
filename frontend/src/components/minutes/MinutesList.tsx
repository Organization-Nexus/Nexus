"use client";

import { ClipboardList, Ellipsis, PenLine, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { format } from "date-fns";

import { useMinutesList } from "@/query/queries/minutes";
import { useDeleteMinutes } from "@/query/mutations/minutes";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { Minutes } from "@/types/minutes";
import { useState } from "react";
import { useProjectUserInfo } from "@/query/queries/project-user";

interface MinutesListProps {
  projectId: number;
  onUpdate: (minutes: Minutes) => void;
  onSelect: (minutes: Minutes) => void;
}

export function MinutesList({
  projectId,
  onUpdate,
  onSelect,
}: MinutesListProps) {
  const [selectedMinutesId, setSelectedMinutesId] = useState<number | null>(
    null
  );
  const { data: minutes, isLoading, isError } = useMinutesList(projectId);
  const { data: currentUser } = useProjectUserInfo(String(projectId));

  const deleteMutation = useDeleteMinutes(projectId);

  const handleDelete = async (minutesId: number) => {
    deleteMutation.mutate(minutesId);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>회의록 목록을 불러오는데 실패했습니다.</div>;
  }

  return (
    <div>
      <div className="space-y-4 bg-white rounded-xl shadow-md p-6 h-[68vh] overflow-y-auto">
        <div className="space-y-2">
          {!minutes || minutes.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              등록된 회의록이 없습니다. 회의록을 작성해보세요 🚀
            </p>
          ) : (
            minutes.map((minute) => (
              <div key={minute.id}>
                <div className="flex justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div
                    className="flex items-center space-x-4 w-full"
                    onClick={() => onSelect(minute)}
                  >
                    <ClipboardList className="h-7 w-7 text-[#966D5C]" />
                    <div>
                      <h3 className="text-lg font-semibold">{minute.title}</h3>
                      <p className="text-xs text-custom-smallText">
                        {minute.author.user.name} ·{" "}
                        {format(new Date(minute.createdAt), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                  </div>
                  {/* 수정, 삭제 버튼 */}
                  {currentUser?.id === minute.author.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="nothing" className="hover:bg-gray-100">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-[70px]">
                        <DropdownMenuItem
                          onClick={() => {
                            onUpdate(minute);
                          }}
                        >
                          <PenLine className="mr-2" /> 수정
                        </DropdownMenuItem>
                        <CustomAlertDialog
                          onConfirm={() => handleDelete(minute.id)}
                          title="정말 삭제하시겠습니까?"
                          confirmText={
                            deleteMutation.isPending ? "삭제 중..." : "삭제"
                          }
                          cancelText="취소"
                        >
                          <DropdownMenuItem
                            className="text-red-600"
                            disabled={deleteMutation.isPending}
                            onSelect={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <Trash2 className="mr-2" />
                            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                          </DropdownMenuItem>
                        </CustomAlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <hr className="mt-1" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
