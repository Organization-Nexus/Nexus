import { Calendar, ClipboardList } from "lucide-react";
import { useState } from "react";

import { format } from "date-fns";
import { useMyMinutesList } from "@/query/queries/minutes";
import { Minutes } from "@/types/minutes";
import { MinutesDetailModal } from "@/components/modal/myPostedList/MinutesDetailModal";

interface PostedMilestoneProps {
  projectId: string;
}

export default function PostedMinutes({ projectId }: PostedMilestoneProps) {
  const {
    data: minutes,
    isLoading,
    error,
  } = useMyMinutesList(Number(projectId));
  const [selectedMinutes, setSelectedMinutes] = useState<Minutes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMinutesClick = (minutes: Minutes) => {
    setSelectedMinutes(minutes);
    setIsModalOpen(true);
  };

  if (isLoading || error || !minutes || minutes.length === 0) {
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">회의록</h2>
        <div className="space-y-4">
          {minutes.map((minute: Minutes, index: number) => (
            <div key={minute.id}>
              <div
                className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleMinutesClick(minute)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList size={18} className="text-indigo-600" />
                  <h3 className="text-base font-medium text-gray-900">
                    {minute.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                  {minute.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>
                      {format(new Date(minute.createdAt), "yyyy.MM.dd")}
                    </span>
                  </div>
                </div>
              </div>
              {index < minutes.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedMinutes !== null && (
        <MinutesDetailModal
          projectId={Number(projectId)}
          minutesId={selectedMinutes.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
