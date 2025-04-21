"use client";

import ImageModal from "@/components/utils/ImageModal";
import {
  CommunityTemplateProps,
  Feed,
  LikeDataResponse,
  Notice,
  Vote,
  VoteOption,
} from "@/types/community";
import { useMemo, useState } from "react";
import UpdateCommunityModal from "@/components/modal/community/UpdateCommunityModal";
import FilePreview from "@/components/utils/FilePreview";
import AuthorInfo from "@/components/utils/AuthorInfo";
import CommunityVoteOptions from "./CommunityVoteOptions";
import { TimeAgo } from "@/components/utils/TimeAgo";
import { formatDate } from "@/utils/dateFormatter";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { likeApi } from "@/app/_api/models/like";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";
import { useDeleteFeed, useDeleteVote } from "@/query/mutations/community";
import {
  useFeedList,
  useNoticeList,
  useVoteList,
} from "@/query/queries/community";
import LikeList from "@/components/modal/community/LikeList";
import CommunityComment from "./CommunityComment";

export default function CommunityTemplate({
  type,
  projectUser,
  projectId,
}: CommunityTemplateProps) {
  const feedData = useFeedList(projectId).data;
  const noticeData = useNoticeList(projectId).data;
  const voteData = useVoteList(projectId).data;
  const deleteFeedMutation = useDeleteFeed(projectId, type);
  const deleteVoteMutation = useDeleteVote(projectId);
  const getVoteStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate < currentDate ? (
      <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
        마감됨
      </span>
    ) : (
      <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-300 rounded">
        진행중
      </span>
    );
  };
  const [state, setState] = useState({
    expandedFeed: null as string | number | null,
    expandedComment: null as string | number | null,
    selectedImage: null as string | null,
    isImageModalOpen: false,
    isUpdateModalOpen: false,
    showImportantOnly: false,
    selectedItem: undefined as Feed | Notice | Vote | undefined,
    selectedItemId: null as string | number | null,
    isLikeListOpen: false,
    likeList: [] as LikeDataResponse[],
    likedItems: {} as { [key: string]: boolean },
    likeCounts: {} as { [key: string]: number },
    commentList: [] as Comment[],
  });

  const initializeLikeStatus = () => {
    const initialLikedItems: { [key: string]: boolean } = {};
    const initialLikeCounts: { [key: string]: number } = {};
    const initializeData = (data: (Feed | Notice | Vote)[], type: string) => {
      data.forEach((item) => {
        const key = `${item.id}-${type}`;
        initialLikedItems[key] = item.likedByUser;
        initialLikeCounts[key] = item.likeCount || 0;
      });
    };
    if (feedData) initializeData(feedData, "feed");
    if (noticeData) initializeData(noticeData, "notice");
    if (voteData) initializeData(voteData, "vote");

    setState((prev) => ({
      ...prev,
      likedItems: { ...prev.likedItems, ...initialLikedItems },
      likeCounts: { ...prev.likeCounts, ...initialLikeCounts },
    }));
  };

  useMemo(() => {
    initializeLikeStatus();
  }, [feedData, noticeData, voteData]);

  const handleLikeClick = async (itemId: number, type: string) => {
    const key = `${itemId}-${type}`;
    setState((prev) => {
      const newLikedItems = { ...prev.likedItems };
      const newLikeCounts = { ...prev.likeCounts };
      const isCurrentlyLiked = newLikedItems[key] ?? false;
      newLikedItems[key] = !isCurrentlyLiked;
      newLikeCounts[key] = newLikedItems[key]
        ? (newLikeCounts[key] || 0) + 1
        : (newLikeCounts[key] || 0) - 1;

      return {
        ...prev,
        likedItems: newLikedItems,
        likeCounts: newLikeCounts,
      };
    });

    let response: { data: LikeDataResponse[] };
    if (type === "feed" || type === "notice") {
      response = await likeApi.feedLike(
        itemId.toString(),
        projectId.toString()
      );
    } else if (type === "vote") {
      response = await likeApi.voteLike(
        itemId.toString(),
        projectId.toString()
      );
    }
    setState((prev) => ({
      ...prev,
      likeList: Array.isArray(response.data) ? response.data : [],
    }));
  };

  const handleLikeCountClick = async (itemId: number, type: string) => {
    const key = `${itemId}-${type}`;
    setState((prev) => ({
      ...prev,
      isLikeListOpen: true,
      selectedItemId: itemId,
    }));

    let response: { data: LikeDataResponse[] };
    if (type === "feed" || type === "notice") {
      response = await likeApi.getFeedLikes(itemId.toString(), projectId);
    } else if (type === "vote") {
      response = await likeApi.getVoteLikes(itemId.toString(), projectId);
    }

    setState((prev) => ({
      ...prev,
      likeList: Array.isArray(response.data) ? response.data : [],
    }));
  };

  const data = useMemo(() => {
    let filteredData: Feed[] | Notice[] | Vote[];
    switch (type) {
      case "feed":
        filteredData = feedData || [];
        break;
      case "notice":
        filteredData = noticeData || [];
        break;
      case "vote":
        filteredData = voteData || [];
        break;
      default:
        filteredData = [];
    }
    if (state.showImportantOnly && type === "notice") {
      filteredData = filteredData.filter(
        (item) => "isImportant" in item && item.isImportant
      );
    }
    return filteredData;
  }, [type, feedData, noticeData, voteData, state.showImportantOnly]);

  const handleToggleExpand = (itemId: string | number) =>
    setState((prev) => ({
      ...prev,
      expandedFeed: prev.expandedFeed === itemId ? null : itemId,
    }));

  const handleCloseImageModal = () =>
    setState((prev) => ({
      ...prev,
      selectedImage: null,
      isImageModalOpen: false,
    }));

  const toggleImportantOnly = () =>
    setState((prev) => ({
      ...prev,
      showImportantOnly: !prev.showImportantOnly,
    }));

  const handleUpdateModalOpen = (item: Feed | Notice) =>
    setState((prev) => ({
      ...prev,
      selectedItem: item,
      isUpdateModalOpen: true,
    }));

  const handleUpdateModalClose = () =>
    setState((prev) => ({
      ...prev,
      selectedItem: undefined,
      isUpdateModalOpen: false,
    }));

  const handleDelete = async (itemId: number | string) => {
    const id = itemId.toString();
    if (type === "feed" || type === "notice") {
      deleteFeedMutation.mutate(id);
    } else if (type === "vote") {
      deleteVoteMutation.mutate(id);
    }
  };

  const handleCommentClick = (type: string, itemId: number) => {
    setState((prev) => ({
      ...prev,
      expandedComment: prev.expandedComment === itemId ? null : itemId,
    }));
  };

  const filteredItems = state.showImportantOnly
    ? data.filter((item) => "isImportant" in item && item.isImportant)
    : data;
  return (
    <div>
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => {
          const createdAt = new Date(item.createdAt);
          const formatedDeadline =
            "deadline" in item && item.deadline
              ? formatDate(item.deadline as string)
              : "";
          const isExpanded = state.expandedFeed === item.id;
          const borderClass =
            "isImportant" in item && item.isImportant
              ? "border-l-4 border-red-300"
              : "";
          const isLiked = state.likedItems[item.id] ?? item.likedByUser;

          return (
            <div
              key={item.id}
              className={`bg-white p-10 rounded-xl shadow-md mb-4 ${borderClass}`}
            >
              <div className="flex justify-between">
                <AuthorInfo
                  profileImage={item.author.user.log.profileImage}
                  name={item.author.user.name}
                  position={item.author.position}
                />
                {projectUser.id === item.author.projectUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="nothing">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {type !== "vote" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateModalOpen(item)}
                        >
                          <PenLine className="mr-2" /> 수정
                        </DropdownMenuItem>
                      )}
                      <CustomAlertDialog
                        onConfirm={() => handleDelete(item.id)}
                        title="정말 삭제하시겠습니까?"
                        confirmText="삭제"
                        cancelText="취소"
                      >
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="mr-2" /> 삭제
                        </DropdownMenuItem>
                      </CustomAlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <hr className="my-4" />
              <div className="flex items-center space-x-2">
                <p className="text-xl font-semibold">{item.title}</p>
                {type === "vote" && (
                  <span className="text-sm text-gray-400 ml-2">
                    {"deadline" in item && item.deadline
                      ? getVoteStatus(item.deadline as string)
                      : getVoteStatus("")}
                  </span>
                )}
                {type === "notice" &&
                  "isImportant" in item &&
                  (item.isImportant as boolean) && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium">
                      중요
                    </span>
                  )}
              </div>
              <hr className="my-4" />

              <div
                className="text-md text-gray-700 my-2 overflow-hidden whitespace-pre-line"
                style={{ maxHeight: isExpanded ? "none" : "100px" }}
              >
                {item.content}
              </div>

              {item.content.length > 200 && (
                <button
                  className="text-blue-400 hover:underline text-sm my-2"
                  onClick={() => handleToggleExpand(item.id)}
                >
                  {isExpanded ? "간략히 보기" : "더보기"}
                </button>
              )}

              {type === "vote" &&
                "voteOptions" in item &&
                "deadline" in item && (
                  <div className="text-sm text-gray-400 my-4">
                    <span>투표 마감일 : </span>
                    <span>{formatedDeadline}</span>
                  </div>
                )}

              {type === "vote" && "voteOptions" in item && (
                <CommunityVoteOptions
                  title={item.title}
                  deadline={formatedDeadline}
                  IsCompletedVote={
                    "deadline" in item && typeof item.deadline === "string"
                      ? new Date(item.deadline) < new Date()
                      : false
                  }
                  voteOptions={item.voteOptions as VoteOption[]}
                  isAnonymous={
                    "isAnonymous" in item ? Boolean(item.isAnonymous) : false
                  }
                  isMultipleChoice={
                    "isMultipleChoice" in item
                      ? Boolean(item.isMultipleChoice)
                      : false
                  }
                  voteId={item.id}
                  projectId={projectId}
                />
              )}
              <div className="max-w-3xl">
                <FilePreview files={item.community_files || []} />
              </div>
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    <button onClick={() => handleLikeClick(item.id, type)}>
                      {state.likedItems[`${item.id}-${type}`] ? (
                        <GoHeartFill className="fill-red-400 w-4 h-4" />
                      ) : (
                        <GoHeart className="text-gray-400 hover:text-red-400 w-4 h-4" />
                      )}
                    </button>
                    <button onClick={() => handleLikeCountClick(item.id, type)}>
                      <p className="text-sm text-gray-400 hover:text-black">
                        {state.likeCounts[`${item.id}-${type}`] || 0}
                      </p>
                    </button>
                  </div>
                  <button
                    onClick={() => handleCommentClick(type, item.id)}
                    className="flex items-center text-gray-400 hover:text-black space-x-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <p className="text-sm">댓글보기</p>
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  <TimeAgo date={new Date(createdAt)} />
                </p>
              </div>
              {state.expandedComment === item.id && (
                <div className="mt-10">
                  <CommunityComment
                    type={type}
                    itemId={item.id}
                    projectId={projectId}
                    projectUserId={projectUser.id}
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="flex items-center justify-center text-sm text-gray-500">
          등록된 커뮤니티가 없습니다. 커뮤니티를 생성해보세요 🚀
        </p>
      )}
      <ImageModal
        isOpen={state.isImageModalOpen}
        imageUrl={state.selectedImage}
        onClose={handleCloseImageModal}
      />
      {state.selectedItem && (
        <UpdateCommunityModal
          type={type}
          isOpen={state.isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          projectId={projectId}
          feedId={state.selectedItem.id.toString()}
          updateData={{
            ...state.selectedItem,
            community_files: state.selectedItem?.community_files ?? undefined,
          }}
        />
      )}
      <LikeList
        isOpen={state.isLikeListOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isLikeListOpen: false,
            selectedItemId: null,
          }))
        }
        likeList={state.likeList || []}
      />
    </div>
  );
}
