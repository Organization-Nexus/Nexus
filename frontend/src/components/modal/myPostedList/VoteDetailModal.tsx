"use client";

import { useEffect, useState } from "react";
import { useVoteDetail } from "@/query/queries/community";
import { Modal } from "../config/ModalMaps";
import { Calendar, Vote, X } from "lucide-react";
import { commentApi } from "@/app/_api/models/comment";
import { communityApi } from "@/app/_api/models/community";
import { CommentResponse } from "@/types/comment";
import CommentsSection from "./CommentsSection";
import FilePreview from "@/components/utils/FilePreview";
import { formatDate } from "@/utils/dateFormatter";

interface VoteOption {
  id: number;
  content: string;
  voteCount: number;
  isSelectedByUser: boolean;
  response_users: string[];
}

interface VoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  voteId: number;
}

export default function VoteDetailModal({
  isOpen,
  onClose,
  projectId,
  voteId,
}: VoteDetailModalProps) {
  const { data: voteDetail, isLoading } = useVoteDetail(
    projectId,
    voteId.toString()
  );
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [showVoters, setShowVoters] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const fetchedComments = await commentApi.getCommentsByVoteId(
          voteId.toString()
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    const fetchVoteOptions = async () => {
      setOptionsLoading(true);
      try {
        const fetchedOptions =
          await communityApi.getVoteOptionByVoteIdAndProjectId(
            voteId.toString(),
            projectId
          );
        setVoteOptions(
          fetchedOptions.map((option) => ({
            ...option,
            response_users: option.response_users.map((user) => user.name),
          }))
        );
      } catch (error) {
        console.error("투표 옵션 불러오기 실패:", error);
        setVoteOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchComments();
    fetchVoteOptions();
  }, [isOpen, voteId, projectId]);

  if (isLoading || !voteDetail) return null;

  const isExpired =
    voteDetail.deadline && new Date(voteDetail.deadline) < new Date();
  const isInProgress =
    !voteDetail.deadline || (!isExpired && voteDetail.deadline);
  const totalVotes = voteOptions.reduce(
    (sum, option) => sum + option.voteCount,
    0
  );

  const toggleVoters = (optionId: number) => {
    setShowVoters((prev) => ({ ...prev, [optionId]: !prev[optionId] }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[80vh] overflow-y-auto"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote className="w-6 h-6 text-indigo-600" />
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {voteDetail.title}
                  </h2>
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
                <div className="text-xs text-gray-500">
                  {formatDate(voteDetail.createdAt)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-md">
            {voteDetail.content}
          </p>
        </div>

        {/* Vote Options Section */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">투표 현황</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-md">
                {voteDetail.isMultipleChoice ? "복수 선택" : "단일 선택"} |{" "}
                {voteDetail.isAnonymous ? "익명" : "공개"}
              </span>
              {voteDetail.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  마감: {formatDate(voteDetail.deadline)}
                </span>
              )}
            </div>
          </div>
          {optionsLoading ? (
            <p className="text-gray-500 text-sm">투표 현황 로딩 중...</p>
          ) : voteOptions.length > 0 ? (
            <ul className="space-y-3">
              {voteOptions.map((option) => {
                const percentage =
                  totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                return (
                  <li
                    key={option.id}
                    className={`p-3 rounded-md text-sm ${
                      option.isSelectedByUser
                        ? "bg-indigo-100 text-indigo-900 border border-indigo-300"
                        : "bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{option.content}</span>
                        {!voteDetail.isAnonymous &&
                          option.response_users.length > 0 && (
                            <button
                              onClick={() => toggleVoters(option.id)}
                              className="text-gray-500 hover:text-gray-700"
                            ></button>
                          )}
                      </div>
                      <span className="font-medium">
                        {option.voteCount} 표 ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-200 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {!voteDetail.isAnonymous &&
                      showVoters[option.id] &&
                      option.response_users.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                          투표자: {option.response_users.join(", ")}
                        </div>
                      )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">투표 옵션이 없습니다.</p>
          )}
        </div>

        {/* Files Section */}
        {voteDetail.community_files &&
          voteDetail.community_files.length > 0 && (
            <div className="py-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                첨부 파일
              </h3>
              <FilePreview files={voteDetail.community_files} />
            </div>
          )}

        {/* Comments Section */}
        <CommentsSection comments={comments} loading={commentsLoading} />
      </div>
    </Modal>
  );
}
