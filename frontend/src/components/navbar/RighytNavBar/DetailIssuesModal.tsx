"use client";

import { useIssueDetail } from "@/query/queries/issue";
import { format } from "date-fns";
import { FileText, GitBranch, X } from "lucide-react";
import Image from "next/image";
import { Modal } from "@/components/modal/config/ModalMaps";

interface DetailIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  milestoneId: number;
  IssueId: number;
}

export default function DetailIssuesModal({
  isOpen,
  onClose,
  projectId,
  milestoneId,
  IssueId,
}: DetailIssuesModalProps) {
  const {
    data: issue,
    isLoading,
    isError,
  } = useIssueDetail(projectId, milestoneId, IssueId);

  console.log("issue", issue);

  if (isLoading)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div>로딩 중...</div>
      </Modal>
    );
  if (isError || !issue)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div>이슈를 불러오는데 실패했습니다.</div>
      </Modal>
    );

  const labelIcon: { [key: string]: string } = {
    feature: "✨",
    refactor: "🛠️",
    bug: "🐛",
    setting: "⚙️",
    test: "🧪",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-full">
        <div className="p-2">
          <div className="flex items-center w-full justify-between">
            <div className="flex justify-start items-center w-full">
              <h1 className="text-xl font-bold">
                <span className="text-custom-point">#{issue.id}</span>{" "}
                {issue.title}
              </h1>
              <div className="flex my-2 ml-4 space-x-2 items-center">
                <p className="border border-custom-point rounded-xl text-custom-point px-2 py-0.5 text-sm">
                  {issue.category === "FE" ? "Frontend" : "Backend"}
                </p>
                <p className="border border-custom-point bg-custom-point rounded-xl text-white px-2 py-0.5 text-sm">
                  {labelIcon[issue.label]} {issue.label}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-1 rounded-md transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex gap-1 text-xs font-semibold text-gray-500">
              <span className="text-custom-point">시작일:</span>
              <span>{format(new Date(issue.start_date), "yyyy-MM-dd")}</span>
              <span className="ml-4 text-custom-point">마감일:</span>
              <span>{format(new Date(issue.end_date), "yyyy-MM-dd")}</span>
            </div>
            <div className="flex items-center">
              <Image
                src={
                  issue.author.user.log.profileImage || "/default-profile.png"
                }
                alt="Profile"
                width={16}
                height={16}
                className="rounded-full object-cover max-w-[16px] max-h-[16px] min-w-[16px] min-h-[16px]"
              />
              <p className="ml-1 text-xs text-gray-600">
                {issue.author.user.name} ({issue.author.position})
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        <div className="space-y-6 p-2">
          <div className="space-y-2">
            <div className="flex items-center text-lg">
              <GitBranch className="mx-1 w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-800">브랜치명</h3>
            </div>
            <hr className="border-gray-200" />
            <div className="pl-6 text-sm text-gray-600">
              {issue.label}/{issue.id}-
              {issue.category === "FE" ? "frontend" : "backend"}-{issue.branch}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-lg">
              <FileText className="mx-1 w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-800">상세 내용</h3>
            </div>
            <hr className="border-gray-200" />
            <div className="pl-6 text-sm text-gray-600 whitespace-pre-wrap">
              {issue.content}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-lg">
              <FileText className="mx-1 w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-800">예상 되는 결과</h3>
            </div>
            <hr className="border-gray-200" />
            <div className="pl-6 text-sm text-gray-600 whitespace-pre-wrap">
              {issue.expected_results}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
