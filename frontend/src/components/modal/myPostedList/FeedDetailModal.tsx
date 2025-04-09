import { useEffect, useState } from "react";
import { useFeedDetail } from "@/query/queries/community";
import { Modal } from "../config/ModalMaps";
import { Newspaper, X } from "lucide-react";
import { commentApi } from "@/app/_api/models/comment";
import { CommentResponse } from "@/types/comment";
import FilePreview from "@/components/utils/FilePreview";
import CommentsSection from "./CommentsSection";

interface FeedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  feedId: number;
}

export default function FeedDetailModal({
  isOpen,
  onClose,
  projectId,
  feedId,
}: FeedDetailModalProps) {
  const { data: feedDetail, isLoading } = useFeedDetail(
    projectId,
    feedId.toString()
  );
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const fetchedComments = await commentApi.getCommentsByFeedId(
          feedId.toString()
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, feedId]);

  if (isLoading || !feedDetail) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[80vh] overflow-y-auto"
    >
      <div className="p-4">
        {/* Header Section */}
        <div className="border-b border-indigo-100 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                {feedDetail.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
            {feedDetail.content}
          </p>
        </div>

        {/* Files Section */}
        {(feedDetail.community_files ?? []).length > 0 && (
          <div className="py-4">
            <FilePreview files={feedDetail.community_files ?? []} />
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection comments={comments} loading={commentsLoading} />
      </div>
    </Modal>
  );
}
