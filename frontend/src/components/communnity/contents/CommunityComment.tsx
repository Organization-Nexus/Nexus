import { TimeAgo } from "@/components/utils/TimeAgo";
import { CornerDownRight } from "lucide-react";
import {
  useFeedOrNoticeList,
  useVoteCommentList,
} from "@/query/queries/comment";
import {
  CommentResponse,
  CreateFeedCommentRequest,
  CreateVoteCommentRequest,
} from "@/types/comment";
import { useState } from "react";
import CommentForm from "./CommentForm";
import {
  useCreateFeedOrNoticeComment,
  useCreateVoteComment,
  useDeleteComment,
} from "@/query/mutations/comment";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";

export default function CommunityComment({
  type,
  itemId,
  projectId,
  projectUserId,
}: {
  type: string;
  itemId: number;
  projectId: string;
  projectUserId: number;
}) {
  const comments =
    type === "feed" || type === "notice"
      ? useFeedOrNoticeList(itemId.toString())
      : useVoteCommentList(itemId.toString());
  const createCommentMutation =
    type === "feed" || type === "notice"
      ? useCreateFeedOrNoticeComment(projectId)
      : useCreateVoteComment(projectId);
  const deleteCommentMutation = useDeleteComment(projectId);

  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set()
  );
  const [replyInput, setReplyInput] = useState<number | null>(null);

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
    });
    setReplyInput(commentId);
  };

  const handleCommentSubmit = (content: string, parentCommentId?: number) => {
    const payload: CreateFeedCommentRequest | CreateVoteCommentRequest =
      type === "feed" || type === "notice"
        ? { content, feedId: itemId, parentCommentId }
        : { content, voteId: itemId, parentCommentId };
    createCommentMutation.mutate(
      payload as CreateFeedCommentRequest & CreateVoteCommentRequest
    );
  };

  const handleDeleteComment = (
    commentId: number,
    commentType: "feed" | "notice" | "vote"
  ) => {
    console.log("commentId", commentId);
    console.log("commentType", commentType);
    deleteCommentMutation.mutate({
      commentId,
      commentType,
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      {comments?.data?.map((comment: CommentResponse) => (
        <div key={comment.id} className="p-3 border-b last:border-none">
          <div className="flex">
            <div>
              <img
                src={comment.projectUser.profileImage}
                alt={comment.projectUser.name}
                className="w-8 h-8 rounded-full mr-2"
              />
            </div>
            <div className="flex flex-col ml-2 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="font-semibold">{comment.projectUser.name}</p>
                  <p className="text-xs text-gray-400 ml-2">
                    <TimeAgo date={new Date(comment.createdAt)} />
                  </p>
                </div>
                <div>
                  {projectUserId === comment.projectUser.id && (
                    <CustomAlertDialog
                      onConfirm={() =>
                        handleDeleteComment(
                          comment.id,
                          type as "feed" | "notice" | "vote"
                        )
                      }
                      title="댓글 삭제"
                      description="정말로 이 댓글을 삭제하시겠습니까?"
                    >
                      <button className="text-xs font-semibold text-red-300 hover:underline">
                        삭제
                      </button>
                    </CustomAlertDialog>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-2 ml-10">
            <button
              onClick={() => toggleReplies(comment.id)}
              className="text-xs text-blue-400 hover:underline flex items-center"
            >
              <CornerDownRight className="w-3 h-3 mr-1" />
              {comment.replies?.length > 0
                ? `답글 ${comment.replies.length}개 보기`
                : "답글 달기"}
            </button>
          </div>

          {expandedReplies.has(comment.id) && (
            <div className="ml-10 mt-2 bg-gray-100 p-2 rounded-md space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex p-2">
                  <div>
                    <img
                      src={reply.projectUser.profileImage}
                      alt={reply.projectUser.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  </div>
                  <div className="flex flex-col ml-2 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="font-semibold text-sm">
                          {reply.projectUser.name}
                        </p>
                        <p className="text-xs text-gray-400 ml-2">
                          <TimeAgo date={new Date(reply.createdAt)} />
                        </p>
                      </div>
                      <div>
                        {projectUserId === reply.projectUser.id && (
                          <CustomAlertDialog
                            onConfirm={() =>
                              handleDeleteComment(
                                reply.id,
                                type as "feed" | "notice" | "vote"
                              )
                            }
                            title="댓글 삭제"
                            description="정말로 이 댓글을 삭제하시겠습니까?"
                          >
                            <button className="text-xs font-semibold text-red-300 hover:underline">
                              삭제
                            </button>
                          </CustomAlertDialog>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
              {replyInput === comment.id && (
                <div className="ml-2 mt-2">
                  <CommentForm
                    onSubmit={(content) =>
                      handleCommentSubmit(content, comment.id)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <CommentForm onSubmit={(content) => handleCommentSubmit(content)} />
    </div>
  );
}
