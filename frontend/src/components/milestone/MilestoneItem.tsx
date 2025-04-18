import { Milestone } from "@/types/milestone";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  Ellipsis,
  PenLine,
  SquarePlus,
  Trash2,
} from "lucide-react";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { useProjectUserInfo } from "@/query/queries/project-user";
import { UpdateMilestoneForm } from "../modal/milestone/UpdateMilestoneForm";
import { Project } from "@/types/project";
import { milestoneApi } from "@/app/_api/models/milestone";
import { useDeleteMilestone } from "@/query/mutations/milestone";
import { useIssueList } from "@/query/queries/issue";
import { IssueList } from "../issue/IssueList";
import { IssueDetail } from "../issue/IssueDetail";
import { CreateIssueForm } from "../modal/issue/CreateIssueForm";

interface MilestoneItemProps {
  milestone: Milestone;
  project: Project;
  onSelect?: (milestoneId: number) => void;
}

export default function MilestoneItem({
  project,
  milestone,
  onSelect,
}: MilestoneItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [updateMilestoneData, setUpdateMilestoneData] =
    useState<Milestone | null>(null);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const projectId = project.id;
  const { data: currentUser } = useProjectUserInfo(String(projectId));
  const { data: issues } = useIssueList(projectId, milestone.id);

  const currentUserId = currentUser?.id;
  const isMilestoneAuthor = currentUserId === milestone.author.id;
  const handleUpdateClick = async (milestoneId: number) => {
    try {
      const detailData = await milestoneApi.getMilestoneByMilestoneId(
        project.id,
        milestoneId
      );
      setUpdateMilestoneData(detailData);
      setIsUpdateModalOpen(true);
    } catch (error) {
      .error("마일스톤 상세 정보 가져오기 실패", error);
    }
  };

  const deleteMutation = useDeleteMilestone(projectId);

  const handleDelete = async (milestoneId: number) => {
    deleteMutation.mutate(milestoneId, {
      onSuccess: () => {
        alert("마일스톤이 삭제되었습니다.");
      },
      onError: (error) => {
        .error("마일스톤 삭제 실패", error);
      },
    });
  };

  const isParticipant = () => {
    // milestone이 없는 경우 처리
    if (!milestone) return false;

    // // 마일스톤 작성자인 경우 true
    // if (currentUserId === milestone?.author?.id) return true;

    // participants 배열에서 현재 사용자가 있는지 확인
    return milestone?.participants?.some(
      (participant) => participant?.member?.id === currentUserId
    );
  };

  const showEllipsisButton = () => {
    // 마일스톤 작성자이거나 참여자인 경우에만 true 반환
    return isMilestoneAuthor || isParticipant();
  };

  {
    return (
      <div className="w-full bg-white rounded-xl shadow">
        <div className="rounded-xl p-5 hover:bg-[#f8faff]">
          {" "}
          <div className="flex items-center justify-between mx-2 gap-3">
            <button
              onClick={(e) => {
                setIsExpanded(!isExpanded);
                if (isExpanded) {
                  setSelectedIssueId(null);
                }
                // e.stopPropagation();
              }}
              className="text-custom-smallText hover:bg-gray-100 rounded-lg"
            >
              <ChevronDown
                size={30}
                className={`transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
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
                {milestone.author.position}
              </span>
            </div>
            <div className="flex-1 items-center ">
              <div
                onClick={() => onSelect?.(milestone.id)}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    ({milestone.category === "FE" ? "Frontend" : "Backend"})
                  </span>
                  <span className="font-bold">{milestone.title}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span>
                    시작일:{" "}
                    {format(new Date(milestone.start_date), "yyyy-MM-dd")}
                  </span>
                  <span className="mx-4">
                    마감일: {format(new Date(milestone.end_date), "yyyy-MM-dd")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {showEllipsisButton() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-custom-smallText hover:bg-gray-100 rounded-lg p-1">
                      <Ellipsis size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[70px]">
                    {isParticipant() && (
                      <>
                        <DropdownMenuItem
                          onClick={() => setIsCreateIssueModalOpen(true)}
                        >
                          <SquarePlus className="mr-2 text-custom-point" /> 이슈
                          등록
                        </DropdownMenuItem>
                        {isMilestoneAuthor && <DropdownMenuSeparator />}
                      </>
                    )}
                    {isMilestoneAuthor && (
                      <div>
                        <DropdownMenuItem
                          onClick={(e) => {
                            handleUpdateClick(milestone.id);
                          }}
                        >
                          <PenLine className="mr-2" /> 수정
                        </DropdownMenuItem>
                        <CustomAlertDialog
                          onConfirm={() => handleDelete(milestone.id)}
                          title="정말 삭제하시겠습니까?"
                          confirmText={
                            deleteMutation.isPending ? "삭제 중..." : "삭제"
                          }
                          cancelText="취소"
                        >
                          <DropdownMenuItem
                            className="text-red-600"
                            disabled={deleteMutation.isPending}
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2" />
                            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                          </DropdownMenuItem>
                        </CustomAlertDialog>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        {isUpdateModalOpen && updateMilestoneData && (
          <UpdateMilestoneForm
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            project={project}
            initialData={updateMilestoneData}
          />
        )}

        {/* 이슈 목록/상세 */}
        <div className="border-t mx-1">
          {selectedIssueId ? (
            <IssueDetail
              projectId={projectId}
              milestoneId={milestone.id}
              issueId={selectedIssueId}
              onClose={() => setSelectedIssueId(null)}
            />
          ) : (
            <div
              className={`
            grid transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }
          `}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5">
                  <IssueList
                    issues={issues || []}
                    currentUserId={currentUserId}
                    // isAuthor={isAuthor}
                    onSelect={(issueId) => setSelectedIssueId(issueId)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {isCreateIssueModalOpen && (
          <CreateIssueForm
            isOpen={isCreateIssueModalOpen}
            onClose={() => setIsCreateIssueModalOpen(false)}
            projectId={projectId}
            milestone={milestone}
          />
        )}
      </div>
    );
  }
}
