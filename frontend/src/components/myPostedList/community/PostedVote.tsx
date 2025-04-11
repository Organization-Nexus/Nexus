"use client";

import { useMyVoteList } from "@/query/queries/community";
import { Vote, Calendar } from "lucide-react";
import { Vote as VoteType } from "@/types/community";
import { useState } from "react";
import VoteDetailModal from "@/components/modal/myPostedList/VoteDetailModal";
import { formatDate } from "@/utils/dateFormatter";

interface PostedVoteProps {
  projectId: string;
}

export default function PostedVote({ projectId }: PostedVoteProps) {
  const { data: votes, isLoading, error } = useMyVoteList(projectId);
  const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoteClick = (id: number) => {
    setSelectedVoteId(id);
    setIsModalOpen(true);
  };

  if (isLoading || error || !votes || votes.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">
          {isLoading
            ? "로딩 중..."
            : error
            ? `오류: ${error.message}`
            : "등록된 투표가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">투표 목록</h2>
        <div className="space-y-4">
          {votes.map((vote: VoteType, index: number) => {
            const isExpired =
              vote.deadline && new Date(vote.deadline) < new Date();
            const isInProgress =
              !vote.deadline || (!isExpired && vote.deadline);
            return (
              <div key={vote.id}>
                <div
                  className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => handleVoteClick(vote.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Vote size={18} className="text-indigo-600" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {vote.title}
                      </h3>
                      {isInProgress ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-300 rounded">
                          진행중
                        </span>
                      ) : isExpired ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                          마감됨
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 bg-gray-100 p-2 rounded-md">
                    {vote.content}
                  </p>
                  <div className="mb-3">
                    <ul className="text-sm text-gray-700 flex flex-wrap gap-2">
                      {vote.voteOptions.map((option) => (
                        <li
                          key={option.id}
                          className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md"
                        >
                          {option.content}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500" />
                      <span>
                        {vote.deadline
                          ? `마감: ${formatDate(vote.deadline)}`
                          : "마감일 없음"}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="bg-gray-200 px-2 py-1 rounded-md">
                        {vote.isMultipleChoice ? "복수 선택" : "단일 선택"} |{" "}
                        {vote.isAnonymous ? "익명" : "공개"}
                      </span>
                    </div>
                  </div>
                </div>
                {index < votes.length - 1 && (
                  <hr className="my-4 border-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {selectedVoteId !== null && (
        <VoteDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          voteId={selectedVoteId}
        />
      )}
    </>
  );
}
