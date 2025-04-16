"use client";

import { useMinutesDetail } from "@/query/queries/minutes";
import { format } from "date-fns";
import { X, Text, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Loading from "../utils/Loading";

interface MinutesDetailProps {
  projectId: number;
  minutesId: number;
  onClose: () => void;
}

export function MinutesDetail({
  projectId,
  minutesId,
  onClose,
}: MinutesDetailProps) {
  const {
    data: minutes,
    isLoading,
    isError,
  } = useMinutesDetail(projectId, minutesId);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>회의록을 불러오는데 실패했습니다.</div>;
  }

  if (!minutes) {
    return <div>회의록이 존재하지 않습니다.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md py-8 px-12 h-[79vh] flex flex-col w-full ">
      <div className="flex justify-end items-center ">
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold mb-2">{minutes.title}</h2>
      <hr className="border-custom-divider" />
      {/* 회의 정보 */}
      <div className="mt-4 space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
        {/* 일시 및 참석자 정보 */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="font-bold text-sm">■ 일시:</span>
            <span className="ml-2">
              {format(
                new Date(`${minutes.meeting_date}T${minutes.meeting_time}`),
                "yyyy. MM. dd (E) HH:mm"
              )}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-sm">■ 참석자:</span>
            <div className="flex items-center ml-2 gap-2">
              {minutes.participants.map((participant: any) => (
                <div className="flex flex-row items-center mr-2">
                  <Image
                    src={participant.member.user.log.profileImage}
                    alt="Profile"
                    width={20}
                    height={20}
                    className="rounded-full object-cover max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px]"
                  />
                  <span key={participant.id} className="ml-1 text-sm">
                    {participant.member.user.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* 안건 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <BadgeCheck className="mx-1 w-4 h-4" />

            <h3 className="font-bold">안건</h3>
          </div>
          <div className="pl-6 whitespace-pre-wrap">{minutes.agenda}</div>
        </div>

        <hr className="border-gray-200" />

        {/* 주제 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Text className="mx-1 w-4 h-4" />
            <h3 className="font-bold">주제</h3>
          </div>
          <div className="pl-6">{minutes.topic}</div>
        </div>

        <hr className="border-gray-200" />

        {/* 회의 내용 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Text className="mx-1 w-4 h-4" />
            <h3 className="font-bold">회의 내용</h3>
          </div>
          <div className="pl-6 whitespace-pre-wrap">{minutes.content}</div>
        </div>

        {/* 결정 사항 */}
        {minutes.decisions && (
          <div className="space-y-4">
            <div className="flex items-center">
              <Text className="mx-1 w-4 h-4" />
              <h3 className="font-bold">결정 사항</h3>
            </div>
            <div className="pl-6 whitespace-pre-wrap">{minutes.decisions}</div>
          </div>
        )}

        {/* 참고 사항 */}
        {minutes.notes && (
          <div className="space-y-4">
            <div className="flex items-center">
              <Text className="mr-1 w-4 h-4" />
              <h3 className="font-bold">참고 사항</h3>
            </div>
            <div className="pl-6">{minutes.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
