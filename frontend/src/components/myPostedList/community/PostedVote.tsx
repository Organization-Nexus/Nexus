"use client";

import { useMyVoteList } from "@/query/queries/community";
import { Vote, Heart, Calendar } from "lucide-react"; // 아이콘 추가
import { Vote as VoteType } from "@/types/community";

interface PostedVoteProps {
  projectId: string;
}

export default function PostedVote({ projectId }: PostedVoteProps) {
  const { data: votes, isLoading, error } = useMyVoteList(projectId);

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

  if (!votes || votes.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">투표가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">투표 목록</h2>
      <div className="space-y-4">
        {votes.map((vote: VoteType, index: number) => (
          <div key={vote.id}>
            <div className="bg-white p-4 rounded-md shadow-sm">
              {/* 투표 제목 */}
              <div className="flex items-center gap-2 mb-2">
                <Vote size={18} className="text-gray-600" />
                <h3 className="text-base font-medium text-gray-900">
                  {vote.title}
                </h3>
              </div>

              {/* 투표 내용 */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 bg-gray-100 p-2 rounded-md">
                {vote.content}
              </p>

              {/* 투표 옵션 */}
              <div className="mb-3">
                <ul className="text-sm text-gray-700 flex flex-wrap gap-2">
                  {vote.voteOptions.map((option) => (
                    <li
                      key={option.id}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >
                      {option.content}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 메타 정보 */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  <span>
                    {new Date(vote.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="text-gray-500" />
                    <span>{vote.likeCount}</span>
                  </div>
                  <span className="bg-gray-200 px-2 py-1 rounded-md">
                    {vote.isMultipleChoice ? "복수 선택" : "단일 선택"} |{" "}
                    {vote.isAnonymous ? "익명" : "공개"}
                  </span>
                </div>
              </div>
            </div>
            {/* 마지막 항목이 아니면 hr 추가 */}
            {index < votes.length - 1 && (
              <hr className="my-4 border-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
