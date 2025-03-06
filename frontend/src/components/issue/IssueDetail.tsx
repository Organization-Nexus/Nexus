"use client";

import { useIssueDetail } from "@/query/queries/issue";
import { format } from "date-fns";
import {
  ChevronLeft,
  Ellipsis,
  FileText,
  GitBranch,
  PenLine,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { useProjectUserInfo } from "@/query/queries/project-user";

interface IssueDetailProps {
  projectId: number;
  milestoneId: number;
  issueId: number;
  onClose: () => void;
}

export function IssueDetail({
  projectId,
  milestoneId,
  issueId,
  onClose,
}: IssueDetailProps) {
  const {
    data: issue,
    isLoading,
    isError,
  } = useIssueDetail(projectId, milestoneId, issueId);
  const { data: currentUser } = useProjectUserInfo(String(projectId));
  const isAuthor = currentUser?.id === issue?.author.id;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // const deleteMutation = useDeleteIssue(projectId);

  // const handleDelete = async (issueId: number) => {
  //   deleteMutation.mutate(issueId, {
  //     onSuccess: () => {
  //       onClose();
  //       alert("이슈가 삭제되었습니다.");
  //     },
  //     onError: (error) => {
  //       console.error("이슈 삭제 실패", error);
  //     },
  //   });
  // };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>이슈를 불러오는데 실패했습니다.</div>;
  if (!issue) return <div>이슈가 존재하지 않습니다.</div>;

  const labelIcon: { [key: string]: string } = {
    feature: "✨",
    refactor: "🛠️",
    bug: "🐛",
    setting: "⚙️",
    test: "🧪",
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl h-[68vh] ">
      <div className="px-8 pt-8">
        {/* <div className="flex my-2 ml-5 space-x-2 items-center">
          <p className="border border-custom-point rounded-xl text-custom-point px-3 py-[2px] text-sm ">
            {issue.category === "FE" ? "Frontend" : "Backend"}
          </p>
          <p className="border border-custom-point bg-custom-point rounded-xl text-white px-3 py-[2px] text-sm ">
            {labelIcon[issue.label]}
            {"  "}
            {issue.label}
          </p>
        </div> */}

        <div className="flex items-center w-full justify-between">
          <div className="flex justify-start items-center w-full">
            <ChevronLeft
              className="cursor-pointer size-8 mr-2 text-custom-smallText hover:bg-gray-50 rounded-lg"
              onClick={onClose}
            />
            <h1 className="text-2xl font-bold">
              #{issue.id} {issue.title}
            </h1>
            <div className="flex my-2 ml-5 space-x-2 items-center">
              <p className="border border-custom-point rounded-xl text-custom-point px-3 py-[2px] text-sm ">
                {issue.category === "FE" ? "Frontend" : "Backend"}
              </p>
              <p className="border border-custom-point bg-custom-point rounded-xl text-white px-3 py-[2px] text-sm ">
                {labelIcon[issue.label]}
                {"  "}
                {issue.label}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-custom-smallText hover:bg-gray-50 rounded-lg p-1 mr-2">
                    <Ellipsis size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[70px]">
                  <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                    <PenLine className="mr-2" /> 수정
                  </DropdownMenuItem>
                  <CustomAlertDialog
                    onConfirm={() => {
                      //   handleDelete(milestone.id);
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

        {/* 시작, 마감일 */}
        <div className="flex justify-between">
          <div className="flex gap-1 text-xs font-semibold text-custom-smallText ml-9 mt-3">
            <span className="text-custom-point">시작일:</span>
            <span>{format(new Date(issue.start_date), "yyyy-MM-dd")}</span>
            <span className="ml-4 text-custom-point">마감일:</span>
            <span>{format(new Date(issue.end_date), "yyyy-MM-dd")}</span>
          </div>
          {/* 작성자 */}
          <div className="flex">
            <div className="flex items-center flex-wrap">
              <div className="flex flex-row items-center mr-2">
                <Image
                  src={issue.author.user.log.profileImage}
                  alt="Profile"
                  width={20}
                  height={20}
                  className="rounded-full object-cover max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px] cursor-pointer hover:opacity-50"
                />

                <p className="ml-1 text-xs">
                  {issue.author.user.name}
                  {"("}
                  {issue.author.position}
                  {")"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-black mt-3 mx-7" />

      {/* 이슈 내용 */}
      <div className="space-y-10 flex-1 overflow-y-auto overflow-x-hidden p-8">
        {/* 브랜치명 */}
        <div className="space-y-2">
          <div className="flex items-center text-xl">
            <GitBranch className="mx-1 w-4 h-4" />
            <h3 className="font-bold">브랜치명</h3>
          </div>
          <hr className="border-gray-200" />
          <div className="pl-6 whitespace-pre-wrap">
            {issue.label}/{issue.id}-
            {issue.category === "FE" ? "frontend" : "backend"}-{issue.branch}
          </div>
        </div>

        {/* 내용 */}
        <div className="space-y-2">
          <div className="flex items-center text-xl">
            <FileText className="mx-1 w-4 h-4" />
            <h3 className="font-bold">상세 내용</h3>
          </div>
          <hr className="border-gray-200" />
          <div className="pl-6 whitespace-pre-wrap mb-2">{issue.content}</div>
        </div>

        {/* 예상 되는 결과 */}
        <div className="space-y-4">
          <div className="flex items-center text-xl">
            <FileText className="mx-1 w-4 h-4" />
            <h3 className="font-bold">예상 되는 결과</h3>
          </div>
          <hr className="border-gray-200" />
          <div className="pl-6 whitespace-pre-wrap ">
            {issue.expected_results}
          </div>
        </div>
      </div>
    </div>
  );
}
