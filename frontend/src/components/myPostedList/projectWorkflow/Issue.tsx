import { Calendar, List } from "lucide-react";
import { useState } from "react";
import { Issue as IssueType } from "@/types/issue";
import { format } from "date-fns";
import { useMyIssueList } from "@/query/queries/project";
import DetailIssuesModal from "@/components/navbar/RighytNavBar/DetailIssuesModal";

interface PostedIssueProps {
  projectId: string;
}

export default function Issue({ projectId }: PostedIssueProps) {
  const { data: issues, isLoading, error } = useMyIssueList(projectId);
  const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setSelectedIssue(null);
    setIsModalOpen(false);
  };

  const handleIssueClick = (issue: IssueType) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  if (isLoading || error || !issues || issues.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">
          {isLoading
            ? "로딩 중..."
            : error
            ? `오류: ${error.message}`
            : "등록된 이슈가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">이슈</h2>
        <div className="space-y-4">
          {issues.map((issue: IssueType, index: number) => (
            <div key={issue.id}>
              <div
                className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleIssueClick(issue)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <List size={18} className="text-indigo-600" />
                  <h3 className="text-base font-medium text-gray-900">
                    {issue.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                  {issue.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>
                      {format(new Date(issue.start_date), "yyyy.MM.dd")} -
                      {format(new Date(issue.end_date), "yyyy.MM.dd")}
                    </span>
                  </div>
                </div>
              </div>
              {index < DetailIssuesModal.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedIssue !== null && (
        <DetailIssuesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          projectId={Number(projectId)}
          milestoneId={selectedIssue.milestone.id}
          IssueId={selectedIssue.id}
        />
      )}
    </>
  );
}
