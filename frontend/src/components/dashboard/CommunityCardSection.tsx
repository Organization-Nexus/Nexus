"use client";

import { useState } from "react";
import { useCommunityDashboard } from "@/query/queries/community";
import { ChevronRight, Newspaper, Siren, Vote } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import FeedDetailModal from "../modal/myPostedList/FeedDetailModal";
import VoteDetailModal from "../modal/myPostedList/VoteDetailModal";
import NoticeDetailModal from "../modal/myPostedList/NoticeDetailModal";

type CardSectionProps = {
  projectId: string;
  title: string;
};

export default function CommunityCardSection({
  projectId,
  title,
}: CardSectionProps) {
  const { data: communities } = useCommunityDashboard(projectId);
  const { notice, feed, vote } = communities ?? {};
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };

  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const openNoticeModal = () => setIsNoticeModalOpen(true);
  const openFeedModal = () => setIsFeedModalOpen(true);
  const openVoteModal = () => setIsVoteModalOpen(true);
  const closeVoteModal = () => setIsVoteModalOpen(false);
  const closeNoticeModal = () => setIsNoticeModalOpen(false);
  const closeFeedModal = () => setIsFeedModalOpen(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
        <button onClick={() => navigateTo(`/myproject/${projectId}/community`)}>
          <ChevronRight />
        </button>
      </div>
      <hr className="my-4" />

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {/* 공지사항 */}
        {notice && (
          <section
            className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition"
            onClick={openNoticeModal}
          >
            <h3 className="flex items-center text-sm font-bold text-indigo-500">
              <Siren className="mr-1 w-4 h-4" />
              공지사항
            </h3>
            <p className="text-base font-semibold text-gray-800">
              {notice.title}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {notice.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(notice.createdAt)}
            </p>
          </section>
        )}

        {/* 피드 */}
        {feed && (
          <section
            className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition"
            onClick={openFeedModal}
          >
            <h3 className="flex items-center text-sm font-bold text-green-600">
              <Newspaper className="mr-1 w-4 h-4" /> 피드
            </h3>
            <p className="text-base font-semibold text-gray-800">
              {feed.title}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {feed.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(feed.createdAt)}
            </p>
          </section>
        )}

        {/* 투표 */}
        {vote && (
          <section
            className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition"
            onClick={openVoteModal}
          >
            <h3 className="flex items-center text-sm font-bold text-purple-600">
              <Vote className="mr-1 w-4 h-4" /> 투표
            </h3>
            <p className="text-base font-semibold text-gray-800">
              {vote.title}
            </p>
            <p className="text-sm text-gray-600">{vote.content}</p>
            <ul className="mt-2 list-none text-sm text-gray-700 space-y-1">
              {vote.options?.map((opt: any) => (
                <li key={opt.id}>
                  <p className="bg-green-100 p-1 rounded-md">{opt.content}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(vote.createdAt)}
            </p>
          </section>
        )}
      </div>

      {feed && (
        <FeedDetailModal
          isOpen={isFeedModalOpen}
          onClose={closeFeedModal}
          projectId={projectId}
          feedId={feed.id}
        />
      )}

      {vote && (
        <VoteDetailModal
          isOpen={isVoteModalOpen}
          onClose={closeVoteModal}
          projectId={projectId}
          voteId={vote.id}
        />
      )}

      {notice && (
        <NoticeDetailModal
          isOpen={isNoticeModalOpen}
          onClose={closeNoticeModal}
          projectId={projectId}
          noticeId={notice.id}
        />
      )}
    </div>
  );
}
