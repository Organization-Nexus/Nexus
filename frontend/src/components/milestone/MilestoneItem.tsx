import { Milestone } from "@/types/milestone";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { useProjectUserInfo } from "@/query/queries/project-user";
import { UpdateMilestoneForm } from "../modal/milestone/UpdateMilestoneForm";
import { Project } from "@/types/project";
import { milestoneApi } from "@/app/_api/models/milestone";
import { useDeleteMilestone } from "@/query/mutations/milestone";

interface MilestoneItemProps {
  milestone: Milestone;
  project: Project;
}

export default function MilestoneItem({
  project,
  milestone,
}: MilestoneItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateMinutesData, setUpdateMinutesData] = useState<Milestone | null>(
    null
  );
  const projectId = project.id;
  const { data: currentUser } = useProjectUserInfo(String(projectId));
  const isAuthor = currentUser?.id === milestone.author.id;

  const handleUpdateClick = async (milestoneId: number) => {
    try {
      // 상세 정보를 가져오는 API
      const detailData = await milestoneApi.getMilestoneByMilestoneId(
        project.id,
        milestoneId
      );
      setUpdateMinutesData(detailData);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("마일스톤 상세 정보 가져오기 실패", error);
    }
  };

  const deleteMutation = useDeleteMilestone(projectId);

  const handleDelete = async (milestoneId: number) => {
    deleteMutation.mutate(milestoneId, {
      onSuccess: () => {
        alert("마일스톤이 삭제되었습니다.");
      },
      onError: (error) => {
        console.error("마일스톤 삭제 실패", error);
      },
    });
  };

  return (
    <div className="w-full p-5 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer ">
      <div className="flex items-center justify-between mx-2">
        <div className="flex items-center gap-3">
          <div className="relative w-[30px] h-[30px] rounded-2xl">
            <Image
              src={milestone.author.user.log?.profileImage}
              alt="Profile Image"
              width={30}
              height={30}
              className="object-cover rounded-2xl max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px]"
              priority
            />
          </div>
          <div className="flex flex-col w-[72px]">
            <span className="font-bold">{milestone.author.user.name}</span>
            <span className="font-semibold text-[10px] leading-none text-custom-smallText">
              {milestone.author.position}{" "}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                ({milestone.category === "FE" ? "Frontend" : "Backend"})
              </span>
              <span className="font-bold">{milestone.title}</span>
            </div>
            <div className="text-xs text-gray-500">
              <span>
                시작일: {format(new Date(milestone.start_date), "yyyy-MM-dd")}
              </span>
              <span className="mx-4">
                마감일: {format(new Date(milestone.end_date), "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        </div>

        {/* 수정 삭제 버튼 */}
        {isAuthor && (
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="nothing" className="hover:bg-gray-100">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[70px]">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    handleUpdateClick(milestone.id);
                  }}
                >
                  <PenLine className="mr-2" /> 수정
                </DropdownMenuItem>
                <CustomAlertDialog
                  onConfirm={() => {
                    handleDelete(milestone.id);
                  }}
                  title="정말 삭제하시겠습니까?"
                  confirmText={deleteMutation.isPending ? "삭제 중..." : "삭제"}
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
          </div>
        )}
      </div>
      {isUpdateModalOpen && updateMinutesData && (
        <UpdateMilestoneForm
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          project={project}
          initialData={updateMinutesData}
        />
      )}
    </div>
  );
}
