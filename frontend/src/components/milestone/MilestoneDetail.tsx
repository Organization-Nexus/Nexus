"use client";

import { useMilestoneDetail } from "@/query/queries/milestone";
import { format } from "date-fns";
import {
  Target,
  FileText,
  NotebookPen,
  ChevronLeft,
  Ellipsis,
  PenLine,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { useProjectUserInfo } from "@/query/queries/project-user";
import { useState } from "react";
import { UpdateMilestoneForm } from "../modal/milestone/UpdateMilestoneForm";
import { Project } from "@/types/project";
import { useDeleteMilestone } from "@/query/mutations/milestone";

interface MilestoneDetailProps {
  project: Project;
  milestoneId: number;
  onClose: () => void;
}

export function MilestoneDetail({
  project,
  milestoneId,
  onClose,
}: MilestoneDetailProps) {
  const projectId = project.id;
  const {
    data: milestone,
    isLoading,
    isError,
  } = useMilestoneDetail(projectId, milestoneId);
  const { data: currentUser } = useProjectUserInfo(String(projectId));
  const isAuthor = currentUser?.id === milestone?.author.id;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const deleteMutation = useDeleteMilestone(projectId);

  const handleDelete = async (milestoneId: number) => {
    deleteMutation.mutate(milestoneId, {
      onSuccess: () => {
        onClose();
        alert("마일스톤이 삭제되었습니다.");
      },
      onError: (error) => {
        console.error("마일스톤 삭제 실패", error);
      },
    });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>마일스톤을 불러오는데 실패했습니다.</div>;
  }

  if (!milestone) {
    return <div>마일스톤이 존재하지 않습니다.</div>;
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md h-[68vh]">
      <div className="px-8 pt-10">
        <div className="flex items-center w-full justify-between">
          <div className="flex justify-start items-center w-full">
            {/* < 이전 버튼 */}
            <ChevronLeft
              className="cursor-pointer size-7 mr-2"
              onClick={onClose}
            />
            {/* 제목, FE/BE */}
            <h1 className="text-2xl font-bold ">{milestone.title}</h1>
            <div className="ml-5 bg-custom-point rounded-xl text-white py-1 px-5 text-[15px] tracking-wide">
              {milestone.category === "FE" ? "Frontend" : "Backend"}
            </div>
          </div>
          <div className="flex items-center justify-end">
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="nothing"
                    className="p-2 mb-2 mx-4 h-6 hover:bg-gray-100"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[70px]">
                  <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                    <PenLine className="mr-2" /> 수정
                  </DropdownMenuItem>
                  <CustomAlertDialog
                    onConfirm={() => {
                      handleDelete(milestone.id);
                    }}
                    title="정말 삭제하시겠습니까?"
                    confirmText={
                      //   deleteMutation.isPending ? "삭제 중..." :
                      "삭제"
                    }
                    cancelText="취소"
                  >
                    <DropdownMenuItem
                      className="text-red-600"
                      //   disabled={deleteMutation.isPending}
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Trash2 className="mr-2" />
                      {
                        //   deleteMutation.isPending ? "삭제 중..." :
                        "삭제"
                      }
                    </DropdownMenuItem>
                  </CustomAlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="">
          <div className="flex justify-between">
            {/* 시작, 마감일 */}
            <div className="flex gap-1 text-xs font-semibold text-custom-smallText ml-9 mt-3">
              <span className="text-custom-point">시작일:</span>
              <span>
                {format(new Date(milestone.start_date), "yyyy-MM-dd")}
              </span>
              <span className="ml-4 text-custom-point">마감일:</span>
              <span>{format(new Date(milestone.end_date), "yyyy-MM-dd")}</span>
            </div>
            {/* 참여자 */}
            <div className="flex">
              <div className="flex items-center flex-wrap">
                {milestone.participants.map((participant) => (
                  <TooltipProvider>
                    <Tooltip>
                      <div
                        key={participant.id}
                        className="flex flex-row items-center mr-2"
                      >
                        <TooltipTrigger>
                          <Image
                            src={participant.member.user.log.profileImage}
                            alt="Profile"
                            width={20}
                            height={20}
                            className="rounded-full object-cover max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px] cursor-pointer hover:opacity-50"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {participant.member.user.name}
                            {"("}
                            {participant.member.user.position}
                            {")"}
                          </p>
                        </TooltipContent>
                      </div>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-black mt-3 mx-7" />
      {/* 마일스톤 내용 */}
      <div className="mt-4 space-y-6 flex-1 overflow-y-auto overflow-x-hidden p-8">
        {/* 목표 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Target className="mx-1 w-4 h-4" />
            <h3 className="font-bold">목표</h3>
          </div>
          <div className="pl-6 whitespace-pre-wrap">{milestone.goal}</div>
        </div>

        <hr className="border-gray-200" />

        {/* 상세 내용 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <FileText className="mx-1 w-4 h-4" />
            <h3 className="font-bold">상세 내용</h3>
          </div>
          <div className="pl-6 whitespace-pre-wrap">{milestone.content}</div>
        </div>

        {/* 참고 사항 */}
        {milestone.note && (
          <>
            <hr className="border-gray-200" />
            <div className="space-y-4">
              <div className="flex items-center">
                <NotebookPen className="mx-1 w-4 h-4" />
                <h3 className="font-bold">참고 사항</h3>
              </div>
              <div className="pl-6 whitespace-pre-wrap">{milestone.note}</div>
            </div>
          </>
        )}
      </div>
      {isUpdateModalOpen && (
        <UpdateMilestoneForm
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          initialData={milestone}
          project={project}
        />
      )}
    </div>
  );
}
