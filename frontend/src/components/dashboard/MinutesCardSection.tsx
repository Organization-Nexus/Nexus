"use client";

import { useMinutesList } from "@/query/queries/minutes";
import { ChevronRight, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Minutes } from "@/types/minutes";
import { useState } from "react";
import { MinutesDetailModal } from "../modal/myPostedList/MinutesDetailModal";
type CardSectionProps = {
  projectId: string;
  title: string;
};

export default function MinutesCardSection({
  projectId,
  title,
}: CardSectionProps) {
  const {
    data: minutes,
    isLoading,
    isError,
  } = useMinutesList(Number(projectId));
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };
  const [selectedMinutes, setSelectedMinutes] = useState<Minutes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMinutesClick = (minutes: Minutes) => {
    setSelectedMinutes(minutes);
    setIsModalOpen(true);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
        <button onClick={() => navigateTo(`/myproject/${projectId}/minutes`)}>
          <ChevronRight />
        </button>
      </div>
      <hr className="my-4" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {!minutes || minutes.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            등록된 회의록이 없습니다. 회의록을 작성해보세요 🚀
          </p>
        ) : (
          minutes.map((minute) => (
            <div key={minute.id}>
              <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div
                  className="flex items-center space-x-4 w-full"
                  onClick={() => handleMinutesClick(minute)}
                >
                  <ClipboardList className="text-[#966D5C]" />
                  <div className="flex justify-between w-full">
                    <p className="text-base font-semibold text-gray-800">
                      {minute.title}
                    </p>
                    <div className="text-xs text-custom-smallText">
                      {/* {minute.author.user.name} ·{" "} */}
                      {format(new Date(minute.createdAt), "yyyy.MM.dd")}
                    </div>
                  </div>
                </div>
              </div>
              {/* <hr className="mt-1" /> */}
            </div>
          ))
        )}
      </div>
      {selectedMinutes !== null && (
        <MinutesDetailModal
          projectId={Number(projectId)}
          minutesId={selectedMinutes.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
