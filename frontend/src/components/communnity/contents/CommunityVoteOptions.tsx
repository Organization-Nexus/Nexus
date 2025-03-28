"use client";

import VoteResponserList from "@/components/modal/community/VoteResponserList";
import { Button } from "@/components/ui/button";
import { useCreateVoteResponse } from "@/query/mutations/community";
import { VoteOption } from "@/types/community";
import { useState } from "react";

interface VoteOptionsProps {
  title: string;
  deadline: string;
  IsCompletedVote: boolean;
  voteOptions: VoteOption[];
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  voteId: number;
  projectId: string;
}

export default function CommunityVoteOptions({
  title,
  deadline,
  IsCompletedVote,
  voteOptions,
  isAnonymous,
  isMultipleChoice,
  voteId,
  projectId,
}: VoteOptionsProps) {
  const [hasVoted, setHasVoted] = useState(
    voteOptions.some((option) => option.isSelectedByUser)
  );
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    voteOptions
      .filter((option) => option.isSelectedByUser)
      .map((option) => option.id)
  );
  const [isVoteStatusOpen, setIsVoteStatusOpen] = useState(false);

  const createVoteResponse = useCreateVoteResponse(
    voteId.toString(),
    projectId
  );
  const handleVote = async () => {
    if (hasVoted) {
      setHasVoted(false);
      setSelectedOptions([...selectedOptions]);
    } else {
      setIsVoting(true);
      try {
        createVoteResponse.mutate(selectedOptions);
        setHasVoted(true);
      } catch (error) {
        console.error("투표 실패", error);
      } finally {
        setIsVoting(false);
      }
    }
  };

  const handleSelectOption = (optionId: number) => {
    if (hasVoted || isVoting) return;

    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        const newOptions = prev.filter((id) => id !== optionId);
        if (newOptions.length === 0) createVoteResponse.mutate([]);
        return newOptions;
      }
      return isMultipleChoice ? [...prev, optionId] : [optionId];
    });
  };

  return (
    <div className="space-y-4 mb-4 rounded-md p-6 bg-gray-50">
      <div>
        <div className="flex justify-between items-center mb-4 text-gray-400">
          <p className="text-sm font-semibold">
            <span className="text-blue-300">
              {isMultipleChoice ? "다중투표 " : "단일투표 "}
            </span>
            {isMultipleChoice
              ? "한 개 이상의 항목을 선택 가능합니다."
              : isAnonymous
              ? "선택한 항목은 다른 사용자에게 표시되지 않습니다."
              : "한 개의 항목만 선택 가능합니다."}
          </p>
          <div className="flex items-center space-x-2">
            {!isAnonymous &&
              (selectedOptions.length > 0 || IsCompletedVote) && (
                <button onClick={() => setIsVoteStatusOpen(true)}>
                  <p className="text-sm text-gray-400 hover:text-gray-500 hover:font-semibold underline">
                    투표현황
                  </p>
                </button>
              )}
            {isAnonymous && (
              <p className="text-red-300 text-sm font-semibold">익명투표</p>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {voteOptions.map((option, idx) => (
            <li
              key={idx}
              className={`flex items-center p-4 rounded-md shadow-md hover:bg-green-50 hover:text-white cursor-pointer transition-colors ${
                selectedOptions.includes(option.id)
                  ? "bg-green-200"
                  : "bg-white"
              } ${
                hasVoted || IsCompletedVote
                  ? "opacity-30 transition-opacity duration-700"
                  : "transition-opacity duration-700"
              }`}
              style={{
                pointerEvents:
                  hasVoted || isVoting || IsCompletedVote ? "none" : "auto",
              }}
              onClick={() => handleSelectOption(option.id)}
            >
              <div className="flex items-center justify-between">
                <div className="text-gray-700">{option.content}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant={hasVoted ? "ghost" : "default"}
          onClick={handleVote}
          disabled={IsCompletedVote}
        >
          {hasVoted ? "다시 투표하기" : "투표하기"}
        </Button>
      </div>

      <VoteResponserList
        title={title}
        deadline={deadline || ""}
        isOpen={isVoteStatusOpen}
        onClose={() => setIsVoteStatusOpen(false)}
        voteId={voteId.toString()}
        projectId={projectId}
      />
    </div>
  );
}
