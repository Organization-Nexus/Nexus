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
import { ChevronDown, Ellipsis, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { useProjectUserInfo } from "@/query/queries/project-user";
import { UpdateMilestoneForm } from "../modal/milestone/UpdateMilestoneForm";
import { Project } from "@/types/project";
import { milestoneApi } from "@/app/_api/models/milestone";
import { useDeleteMilestone } from "@/query/mutations/milestone";
import { useIssueList } from "@/query/queries/issue";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [updateMinutesData, setUpdateMinutesData] = useState<Milestone | null>(
    null
  );

  const projectId = project.id;
  const { data: currentUser } = useProjectUserInfo(String(projectId));
  const { data: issues } = useIssueList(projectId, milestone.id);

  const isAuthor = currentUser?.id === milestone.author.id;

  const handleUpdateClick = async (milestoneId: number) => {
    try {
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
    <div className="w-full bg-white rounded-xl shadow cursor-pointer ">
      <div className="p-5">
        {" "}
        {/* hover:bg-gray-50 cursor-pointer 제거 */}
        <div className="flex items-center justify-between mx-2">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                setIsExpanded(!isExpanded);
                e.stopPropagation();
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

          <div className="flex items-center gap-2">
            {isAuthor && (
              <div
                className="flex items-center"
                // onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-custom-smallText hover:bg-gray-100 rounded-lg p-1">
                      <Ellipsis size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[70px]">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이슈 목록 (확장 시 표시) */}
      <div
        className={`
    grid transition-all duration-300 ease-in-out
    ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
  `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 border-t">
            <div className="mt-4 space-y-2">
              {issues?.map((issue) => (
                // <div
                //   key={issue.id}
                //   className="p-3 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out"
                // >
                //   <div className="flex items-center justify-between">
                //     <div>
                //       <div className="flex items-center gap-2">
                //         {/* <span className={`w-2 h-2 rounded-full ${
                //         issue.status === '진행중' ? 'bg-green-500' :
                //         issue.status === '진행예정' ? 'bg-yellow-500' : 'bg-gray-500'
                //       }`} /> */}
                //         <span className="font-medium">{issue.title}</span>
                //       </div>
                //       <div className="text-sm text-gray-500 mt-1">
                //         담당자: {issue.author.user.name} • {issue.label}
                //       </div>
                //     </div>
                //     <span
                //       className={`px-2 py-1 rounded-full text-xs ${
                //         issue.category === "FE"
                //           ? "bg-blue-100 text-blue-800"
                //           : "bg-green-100 text-green-800"
                //       }`}
                //     >
                //       {issue.category}
                //     </span>
                //   </div>
                // </div>
                <div
                  key={issue.id}
                  className="p-3 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between mx-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-[30px] h-[30px] rounded-2xl">
                        <Image
                          src={issue.author.user.log.profileImage}
                          alt="Profile Image"
                          width={30}
                          height={30}
                          className="object-cover rounded-2xl max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px]"
                          priority
                        />
                      </div>
                      <div className="flex flex-col w-[72px]">
                        <span className="font-bold">
                          {issue.author.user.name}
                        </span>
                        <span className="font-semibold text-[10px] leading-none text-custom-smallText">
                          {issue.author.position}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold"> #{issue.id}</span>
                          <span className="font-bold">{issue.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>
                            시작일:{" "}
                            {format(new Date(issue.start_date), "yyyy-MM-dd")}
                          </span>
                          <span className="mx-4">
                            마감일:{" "}
                            {format(new Date(issue.end_date), "yyyy-MM-dd")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAuthor && (
                        <div
                          className="flex items-center"
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-custom-smallText hover:bg-gray-100 rounded-lg p-1">
                                <Ellipsis size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-[70px]">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateClick(milestone.id);
                                }}
                              >
                                <PenLine className="mr-2" /> 수정
                              </DropdownMenuItem>
                              <CustomAlertDialog
                                onConfirm={() => handleDelete(milestone.id)}
                                title="정말 삭제하시겠습니까?"
                                confirmText={
                                  deleteMutation.isPending
                                    ? "삭제 중..."
                                    : "삭제"
                                }
                                cancelText="취소"
                              >
                                <DropdownMenuItem
                                  className="text-red-600"
                                  disabled={deleteMutation.isPending}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2" />
                                  {deleteMutation.isPending
                                    ? "삭제 중..."
                                    : "삭제"}
                                </DropdownMenuItem>
                              </CustomAlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!issues || issues.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">
                  등록된 이슈가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
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
