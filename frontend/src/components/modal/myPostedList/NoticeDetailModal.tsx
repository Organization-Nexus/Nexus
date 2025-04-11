import { useEffect, useState } from "react";
import { useNoticeDetail } from "@/query/queries/community";
import { Modal } from "../config/ModalMaps";
import { Siren, X } from "lucide-react";
import { commentApi } from "@/app/_api/models/comment";
import { CommentResponse } from "@/types/comment";
import CommentsSection from "./CommentsSection";
import FilePreview from "@/components/utils/FilePreview";
import { formatDate } from "@/utils/dateFormatter";

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  noticeId: number;
}

export default function NoticeDetailModal({
  isOpen,
  onClose,
  projectId,
  noticeId,
}: NoticeDetailModalProps) {
  const { data: noticeDetail, isLoading } = useNoticeDetail(
    projectId,
    noticeId.toString()
  );
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const fetchedComments = await commentApi.getCommentsByFeedId(
          noticeId.toString()
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
  }, [isOpen, noticeId]);

  if (isLoading || !noticeDetail) return null;

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
              <Siren className="w-6 h-6 text-indigo-600" />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {noticeDetail.title}
                  </h2>
                  {noticeDetail.isImportant && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium">
                      중요
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(noticeDetail.createdAt)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
            {noticeDetail.content}
          </p>
        </div>

        {/* Files Section */}
        {(noticeDetail.community_files ?? []).length > 0 && (
          <div className="py-4">
            <FilePreview files={noticeDetail.community_files ?? []} />
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection comments={comments} loading={commentsLoading} />
      </div>
    </Modal>
  );
}
