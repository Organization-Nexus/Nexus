import { Calendar } from "lucide-react";
import { useState } from "react";
import { Milestone as MilestoneType } from "@/types/milestone";
import { useMyMilestoneList } from "@/query/queries/milestone";
import { Milestone as MilestoneIcon } from "lucide-react";
import { format } from "date-fns";
import DetailMilestoneModal from "@/components/navbar/RighytNavBar/DetailMilestoneModal";
interface PostedMilestoneProps {
  projectId: string;
}

export default function Milestone({ projectId }: PostedMilestoneProps) {
  const {
    data: milestones,
    isLoading,
    error,
  } = useMyMilestoneList(Number(projectId));
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMilestoneClick = (milestone: MilestoneType) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  if (isLoading || error || !milestones || milestones.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">
          {isLoading
            ? "로딩 중..."
            : error
            ? `오류: ${error.message}`
            : "등록된 마일스톤이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">마일스톤</h2>
        <div className="space-y-4">
          {milestones.map((milestone: MilestoneType, index: number) => (
            <div key={milestone.id}>
              <div
                className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleMilestoneClick(milestone)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MilestoneIcon size={18} className="text-indigo-600" />
                  <h3 className="text-base font-medium text-gray-900">
                    {milestone.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                  {milestone.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>
                      {format(new Date(milestone.start_date), "yyyy.MM.dd")} -
                      {format(new Date(milestone.end_date), "yyyy.MM.dd")}
                    </span>
                  </div>
                </div>
              </div>
              {index < milestones.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedMilestone !== null && (
        <DetailMilestoneModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
        />
      )}
    </>
  );
}
