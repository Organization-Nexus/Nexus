"use client";

import {
  useMilestonesByProjectIds,
  useMyIssueList,
} from "@/query/queries/project";
import { Issue } from "@/types/issue";
import { Milestone } from "@/types/milestone";
import {
  ChevronRight,
  CornerDownRight,
  Milestone as MilestoneIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DetailMilestoneModal from "../navbar/RighytNavBar/DetailMilestoneModal";
import DetailIssuesModal from "../navbar/RighytNavBar/DetailIssuesModal";
import { format } from "date-fns";

type CardSectionProps = {
  projectId: string;
  title: string;
};

export default function TodoCardSection({
  projectId,
  title,
}: CardSectionProps) {
  const { data: projectMilestones, isLoading } =
    useMilestonesByProjectIds(projectId);
  // projectMilestones가 바로 milestones 배열이라고 가정
  const milestones: Milestone[] = projectMilestones?.[0]?.milestones || [];
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };
  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsIssueModalOpen(true);
  };
  const { data: allIssues, isLoading: isIssuesLoading } =
    useMyIssueList(projectId);

  const router = useRouter();
  // 현재 날짜 이후의 이슈들만 필터링
  const issues =
    allIssues?.filter((issue) => {
      const endDate = new Date(issue.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜만 비교
      return endDate >= today;
    }) || [];

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
        <button
          onClick={() => navigateTo(`/myproject/${projectId}/milestones`)}
        >
          <ChevronRight />
        </button>
      </div>
      <hr className="my-4" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {!milestones || milestones.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            등록된 업무가 없습니다.
          </p>
        ) : (
          milestones.map((milestone: Milestone) => (
            <div key={milestone.id} className="mb-3">
              {/* 마일스톤 헤더 */}
              <div className="flex border p-2 rounded hover:bg-gray-50 cursor-pointer">
                <div
                  className="flex justify-between items-center w-full"
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="flex space-x-4 items-center ">
                    <h3 className="flex text-sm font-bold text-orange-400">
                      <MilestoneIcon size={20} className="mr-1" /> 마일스톤
                    </h3>
                    <p className="text-base font-semibold text-gray-800">
                      {milestone.title.length > 20
                        ? milestone.title.slice(0, 20) + "..."
                        : milestone.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate max-w-md">
                      {milestone.goal.length > 30
                        ? milestone.goal.slice(0, 30) + "..."
                        : milestone.goal}
                    </p>
                  </div>

                  <div className="text-xs text-custom-smallText">
                    ~ {format(new Date(milestone.end_date), "yyyy.MM.dd")}
                  </div>
                </div>
              </div>

              {/* 해당 마일스톤에 속한 이슈들 */}
              <div className=" mt-1">
                {issues
                  .filter((issue) => issue.milestone.id === milestone.id)
                  .map((issue: Issue) => (
                    <div key={issue.id} onClick={() => handleIssueClick(issue)}>
                      <div className="flex items-center justify-between bg-gray-50 text-sm text-gray-600 bg-white p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CornerDownRight size={15} />
                          <div className="flex gap-2">
                            <span className="bg-indigo-100 text-indigo-400 px-1 rounded text-xs">
                              {issue.category}
                            </span>
                            <span className="bg-green-100 text-green-400 px-1 rounded text-xs">
                              {issue.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            {issue.title.length > 20
                              ? issue.title.slice(0, 20) + "..."
                              : issue.title}
                          </p>
                          <p className="text-xs text-gray-600 truncate max-w-md">
                            {issue.content.length > 30
                              ? issue.content.slice(0, 30) + "..."
                              : issue.content}
                          </p>
                        </div>

                        <div className="text-xs text-custom-smallText">
                          ~ {format(new Date(milestone.end_date), "yyyy.MM.dd")}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
      {selectedMilestone !== null && (
        <DetailMilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          milestone={selectedMilestone}
        />
      )}
      {selectedIssue !== null && (
        <DetailIssuesModal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          projectId={Number(projectId)}
          milestoneId={selectedIssue.milestone.id}
          issue={selectedIssue}
        />
      )}
    </div>
  );
}
