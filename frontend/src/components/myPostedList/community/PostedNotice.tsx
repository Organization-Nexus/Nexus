"use client";

import { useMyNoticeList } from "@/query/queries/community";
import { Calendar, Siren } from "lucide-react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Notice } from "@/types/community";

interface PostedNoticeProps {
  projectId: string;
}

export default function PostedNotice({ projectId }: PostedNoticeProps) {
  const { data: notices, isLoading, error } = useMyNoticeList(projectId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">오류: {error.message}</p>
      </div>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">등록된 공지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">공지사항</h2>
      <div className="space-y-4">
        {notices.map((notice: Notice, index: number) => (
          <div key={notice.id}>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Siren size={18} className="text-indigo-600" />
                <h3 className="text-base font-medium text-gray-900">
                  {notice.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                {notice.content}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  <span>
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-1">
                    {notice.likedByUser ? (
                      <GoHeartFill size={14} className="fill-red-400" />
                    ) : (
                      <GoHeart size={14} className="text-gray-500" />
                    )}
                    <span>{notice.likeCount}</span>
                  </div>
                  {notice.isImportant && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium">
                      중요
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 항목 구분선 */}
            {index < notices.length - 1 && (
              <hr className="my-4 border-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
