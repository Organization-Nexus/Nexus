"use client";

import { Checkbox } from "@/components/ui/checkbox";
import ImageModal from "@/components/utils/ImageModal";
import {
  Community,
  CommunityTemplateProps,
  LikeDataResponse,
  Notice,
} from "@/types/community";
import { useState } from "react";
import UpdateCommunityModal from "@/components/modal/community/UpdateCommunityModal";
import FilePreview from "@/components/utils/FilePreview";
import AuthorInfo from "@/components/utils/AuthorInfo";
import CommunityVoteOptions from "./CommunityVoteOptions";
import { TimeAgo } from "@/components/utils/TimeAgo";
import { formatDate } from "@/utils/dateFormatter";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { likeApi } from "@/app/_api/models/like";
import LikeList from "@/components/modal/community/LikeList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";
import { useDeleteFeed, useDeleteVote } from "@/query/mutations/community";

export default function CommunityTemplate({
  type,
  items,
  projectUser,
  projectId,
}: CommunityTemplateProps) {
  const [state, setState] = useState({
    expandedFeed: null as string | number | null,
    selectedImage: null as string | null,
    isImageModalOpen: false,
    isUpdateModalOpen: false,
    showImportantOnly: false,
    selectedItem: undefined as Community | Notice | undefined,
    updatedItems: items,
    isLikeListOpen: false,
    selectedItemId: null as string | number | null,
    likeList: [] as LikeDataResponse[],
  });

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

  const handleUpdateModalOpen = (item: Community | Notice) =>
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
  const deleteFeedMutation = useDeleteFeed(projectId, type);
  const deleteVoteMutation = useDeleteVote(projectId);

  const handleDelete = async (itemId: number) => {
    const id = itemId.toString();
    if (type === "피드" || type === "공지사항") {
      deleteFeedMutation.mutate(id);
    } else if (type === "투표") {
      deleteVoteMutation.mutate(id);
    }
  };

  const filteredItems = state.showImportantOnly
    ? state.updatedItems.filter(
        (item) => "isImportant" in item && item.isImportant
      )
    : state.updatedItems;

  const getVoteStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    if (deadlineDate < currentDate) {
      return (
        <div className="text-gray-300 border-2 border-gray-300 px-2 py-1 rounded-md">
          종료됨
        </div>
      );
    } else {
      return (
        <div className="text-blue-300 border-2 border-blue-300 px-2 py-1 rounded-md">
          진행중
        </div>
      );
    }
  };

  const handleLikeToggle = async (itemId: number) => {
    const updatedItems = state.updatedItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          likedByUser: !item.likedByUser,
          likeCount: item.likedByUser ? item.likeCount - 1 : item.likeCount + 1,
        };
      }
      return item;
    });

    setState((prev) => ({
      ...prev,
      updatedItems,
    }));
    if (type === "피드" || type === "공지사항") {
      await likeApi.feedLike(itemId.toString(), projectId.toString());
    } else if (type === "투표") {
      await likeApi.voteLike(itemId.toString(), projectId.toString());
    }
  };

  const handleLikeCountClick = async (itemId: number) => {
    setState((prev) => ({
      ...prev,
      isLikeListOpen: true,
      selectedItemId: itemId,
    }));
    let response: { data: LikeDataResponse[] };
    if (type === "피드" || type === "공지사항") {
      response = await likeApi.getFeedLikes(
        itemId.toString(),
        projectId.toString()
      );
    } else if (type === "투표") {
      response = await likeApi.getVoteLikes(
        itemId.toString(),
        projectId.toString()
      );
    }

    setState((prev) => ({
      ...prev,
      likeList: Array.isArray(response.data) ? response.data : [],
    }));
  };

  return (
    <div>
      <div className="my-2">
        <div className="flex items-center p-4 rounded-md bg-white shadow-md justify-end">
          {type === "공지사항" && (
            <>
              <Checkbox
                checked={state.showImportantOnly}
                onCheckedChange={toggleImportantOnly}
              />
              <span className="ml-2 font-semibold">중요 항목만 보기</span>
            </>
          )}
          {type === "피드" && <>필터 및 검색</>}
          {type === "투표" && <>필터 및 검색</>}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => {
          const createdAt = new Date(item.createdAt);
          const formatedDeadline =
            "deadline" in item && item.deadline
              ? formatDate(item.deadline)
              : "";
          const isExpanded = state.expandedFeed === item.id;
          const borderClass =
            "isImportant" in item && item.isImportant
              ? "border-2 border-red-200"
              : "border border-gray-100";
          const isLiked = item.likedByUser;

          return (
            <div
              key={item.id}
              className={`bg-white p-10 rounded-md shadow-md mb-2 ${borderClass}`}
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
                      <DropdownMenuItem
                        onClick={() => handleUpdateModalOpen(item)}
                      >
                        <PenLine className="mr-2" /> 수정
                      </DropdownMenuItem>
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
              <div className="flex items-center space-x-4">
                <p className="text-xl font-semibold">{item.title}</p>
                {type === "투표" && (
                  <span className="text-sm text-gray-400 ml-2">
                    {"deadline" in item && item.deadline
                      ? getVoteStatus(item.deadline)
                      : getVoteStatus("")}
                  </span>
                )}
              </div>
              <hr className="my-4" />

              <div
                className="text-md text-gray-700 my-2 overflow-hidden"
                style={{ height: isExpanded ? "auto" : "100px" }}
              >
                {item.content}
              </div>

              {item.content.length > 500 && (
                <button
                  className="text-blue-400 hover:underline text-sm my-2"
                  onClick={() => handleToggleExpand(item.id)}
                >
                  {isExpanded ? "간략히 보기" : "더보기"}
                </button>
              )}

              {type === "투표" && "voteOptions" in item && item.deadline && (
                <div className="text-sm text-gray-400 my-4">
                  <span>투표 마감일 : </span>
                  <span>{formatedDeadline}</span>
                </div>
              )}

              {type === "투표" && "voteOptions" in item && (
                <CommunityVoteOptions
                  title={item.title}
                  deadline={formatedDeadline}
                  IsCompletedVote={
                    item.deadline ? new Date(item.deadline) < new Date() : false
                  }
                  voteOptions={item.voteOptions}
                  isAnonymous={item.isAnonymous}
                  isMultipleChoice={item.isMultipleChoice}
                  voteId={item.id}
                  projectId={projectId}
                />
              )}

              <FilePreview files={item.community_files || []} />
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleLikeToggle(item.id)}>
                    {isLiked ? (
                      <GoHeartFill className="fill-red-400" />
                    ) : (
                      <GoHeart className="text-gray-400 hover:text-red-400" />
                    )}
                  </button>
                  <button onClick={() => handleLikeCountClick(item.id)}>
                    <p className="text-sm text-gray-400 hover:text-black">
                      {item.likeCount}
                    </p>
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  <TimeAgo date={new Date(createdAt)} />
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">표시할 항목이 없습니다.</p>
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
