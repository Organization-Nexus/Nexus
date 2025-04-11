import { useState } from "react";
import { TimeAgo } from "@/components/utils/TimeAgo";
import { CornerDownRight } from "lucide-react";
import { CommentResponse } from "@/types/comment";

interface CommentsSectionProps {
  comments: CommentResponse[];
  loading: boolean;
}

export default function CommentsSection({
  comments,
  loading,
}: CommentsSectionProps) {
  const [showComments, setShowComments] = useState(false);
  const [openReplies, setOpenReplies] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleComments = () => setShowComments((prev) => !prev);
  const toggleReplies = (commentId: number) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="mt-4">
      <button
        onClick={toggleComments}
        className="flex items-center gap-2 hover:underline hover:font-semibold text-blue-500 mb-2 text-xs"
      >
        <h3 className="flex items-center">
          <CornerDownRight className="w-3 h-3 mr-1" />
          댓글보기
          <span className="pl-1">({comments.length})</span>
        </h3>
      </button>

      {loading ? (
        <div className="text-center text-gray-500">댓글 로딩 중...</div>
      ) : showComments ? (
        comments.length > 0 ? (
          <div className="bg-gray-100 rounded-lg p-4 space-y-6">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex gap-3">
                  <img
                    src={comment.projectUser.profileImage}
                    alt={comment.projectUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800">
                        {comment.projectUser.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        <TimeAgo date={new Date(comment.createdAt)} />
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Replies with Toggle */}
                    {comment.replies && comment.replies.length > 0 && (
                      <>
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-blue-500 hover:underline mt-2 flex items-center text-xs"
                        >
                          <CornerDownRight className="w-3 h-3 mr-1" />
                          대댓글보기 ({comment.replies.length})
                        </button>
                        {openReplies[comment.id] && (
                          <div className="mt-3 space-y-4 bg-gray-200 rounded-lg p-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <img
                                  src={reply.projectUser.profileImage}
                                  alt={reply.projectUser.name}
                                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-800">
                                      {reply.projectUser.name}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      <TimeAgo
                                        date={new Date(reply.createdAt)}
                                      />
                                    </span>
                                  </div>
                                  <p className="mt-1 text-gray-700 leading-relaxed whitespace-pre-line">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">댓글이 없습니다.</div>
        )
      ) : null}
    </div>
  );
}
