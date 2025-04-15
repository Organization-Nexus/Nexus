"use client";

import { useState } from "react";
import { useIssueList } from "@/query/queries/issue";
import { ChevronDown, ChevronRight } from "lucide-react";
import DetailIssuesModal from "./DetailIssuesModal";

interface MilestoneIssuesProps {
  projectId: number;
  milestoneId: number;
  isIssuesOpen: boolean;
  toggleIssues: () => void;
}

export default function MilestoneIssues({
  projectId,
  milestoneId,
  isIssuesOpen,
  toggleIssues,
}: MilestoneIssuesProps) {
  const { data: issues, isLoading: isIssuesLoading } = useIssueList(
    projectId,
    milestoneId
  );

  console.log("🐰 issues", issues);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasIssues = issues && issues.length > 0;

  const truncateTitle = (title: string, maxLength: number = 12) =>
    title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;

  const openModal = (issueId: number) => {
    setSelectedIssueId(issueId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedIssueId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {hasIssues && (
        <button
          onClick={toggleIssues}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 ml-2 mt-1"
        >
          {isIssuesOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          이슈 보기
          <span className="text-gray-400">({issues.length})</span>
        </button>
      )}
      {isIssuesOpen && (
        <div className="ml-2 bg-gray-100 p-2 rounded-xl my-1">
          {isIssuesLoading ? (
            <div className="text-gray-500 text-sm">이슈 로딩 중...</div>
          ) : hasIssues ? (
            <ul className="space-y-1">
              {issues.map((issue) => (
                <li
                  key={issue.id}
                  onClick={() => openModal(issue.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-gray-800 flex-1 min-w-0">
                    {truncateTitle(issue.title)}
                  </span>
                  <div className="flex gap-2">
                    <span className="bg-indigo-100 text-indigo-400 px-1 rounded text-xs">
                      {issue.category}
                    </span>
                    <span className="bg-green-100 text-green-400 px-1 rounded text-xs">
                      {issue.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      {selectedIssueId !== null && (
        <DetailIssuesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          projectId={projectId}
          milestoneId={milestoneId}
          IssueId={selectedIssueId}
        />
      )}
    </>
  );
}
