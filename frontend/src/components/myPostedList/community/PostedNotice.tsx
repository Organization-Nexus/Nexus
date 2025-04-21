"use client";

import { useMyNoticeList } from "@/query/queries/community";
import { Calendar, Siren } from "lucide-react";
import { useState } from "react";
import NoticeDetailModal from "@/components/modal/myPostedList/NoticeDetailModal";
import { Notice } from "@/types/community";
import { formatDate } from "@/utils/dateFormatter";

interface PostedNoticeProps {
  projectId: string;
}

export default function PostedNotice({ projectId }: PostedNoticeProps) {
  const { data: notices, isLoading, error } = useMyNoticeList(projectId);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNoticeClick = (id: number) => {
    setSelectedNoticeId(id);
    setIsModalOpen(true);
  };

  if (isLoading || error || !notices || notices.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">
          {isLoading
            ? "로딩 중..."
            : error
            ? `오류: ${error.message}`
            : "등록된 공지사항이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">공지사항</h2>
        <div className="space-y-4">
          {notices.map((notice: Notice, index: number) => (
            <div key={notice.id}>
              <div
                className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleNoticeClick(notice.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Siren size={18} className="text-indigo-600" />
                  <h3 className="text-base font-medium text-gray-900">
                    {notice.title}
                  </h3>

                  {notice.isImportant && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium">
                      중요
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                  {notice.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>
                      {notice.createdAt
                        ? formatDate(notice.createdAt)
                        : "날짜 없음"}
                    </span>
                  </div>
                </div>
              </div>
              {index < notices.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedNoticeId !== null && (
        <NoticeDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          noticeId={selectedNoticeId}
        />
      )}
    </>
  );
}
