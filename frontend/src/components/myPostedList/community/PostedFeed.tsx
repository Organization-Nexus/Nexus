import { useMyFeedList } from "@/query/queries/community";
import { Calendar, Newspaper } from "lucide-react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useState } from "react";
import FeedDetailModal from "@/components/modal/myPostedList/FeedDetailModal";
import { Feed } from "@/types/community";
import { formatDate } from "@/utils/dateFormatter";

interface PostedFeedProps {
  projectId: string;
}

export default function PostedFeed({ projectId }: PostedFeedProps) {
  const { data: feeds, isLoading, error } = useMyFeedList(projectId);
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFeedClick = (id: number) => {
    setSelectedFeedId(id);
    setIsModalOpen(true);
  };

  if (isLoading || error || !feeds || feeds.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">
          {isLoading
            ? "로딩 중..."
            : error
            ? `오류: ${error.message}`
            : "등록된 피드가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">피드</h2>
        <div className="space-y-4">
          {feeds.map((feed: Feed, index: number) => (
            <div key={feed.id}>
              <div
                className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleFeedClick(feed.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper size={18} className="text-indigo-600" />
                  <h3 className="text-base font-medium text-gray-900">
                    {feed.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded-md line-clamp-3">
                  {feed.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>
                      {feed.createdAt
                        ? formatDate(feed.createdAt)
                        : "날짜 없음"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {feed.likedByUser ? (
                      <GoHeartFill size={14} className="fill-red-400" />
                    ) : (
                      <GoHeart size={14} className="text-gray-500" />
                    )}
                    <span>{feed.likeCount}</span>
                  </div>
                </div>
              </div>
              {index < feeds.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedFeedId !== null && (
        <FeedDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          feedId={selectedFeedId}
        />
      )}
    </>
  );
}
