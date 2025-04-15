"use client";

import { useMinutesList } from "@/query/queries/minutes";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
type CardSectionProps = {
  projectId: string;
  title: string;
  // onUpdate: (minutes: Minutes) => void,
  // onSelect: (minutes: Minutes) => void
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[20vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <hr className="my-4" />
      <div className="space-y-2">
        {!minutes || minutes.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            등록된 회의록이 없습니다. 회의록을 작성해보세요 🚀
          </p>
        ) : (
          minutes.map((minute) => (
            <div key={minute.id}>
              <div className="flex justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div
                  className="flex items-center space-x-4 w-full"
                  // onClick={() => onSelect(minute)}
                >
                  <ClipboardList className="text-[#966D5C]" />
                  <div className="flex justify-between w-full">
                    <div className=" font-semibold">{minute.title}</div>
                    <div className="text-xs text-custom-smallText">
                      {/* {minute.author.user.name} ·{" "} */}
                      {format(new Date(minute.createdAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
              {/* <hr className="mt-1" /> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
