import { Checkbox } from "@/components/ui/checkbox";
import ImageModal from "@/components/utils/ImageModal";
import { Community, CommunityTemplateProps, Notice } from "@/types/community";
import { convertToKST } from "@/utils/convertToKST";
import { useState } from "react";
import UpdateCommunityModal from "@/components/modal/community/UpdateCommunityModal";
import FilePreview from "@/components/utils/FilePreview";
import AuthorInfo from "@/components/utils/AuthorInfo";
import CommunityVoteOptions from "./CommunityVoteOptions";
import { TimeAgo } from "@/components/utils/TimeAgo";

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

  const filteredItems = state.showImportantOnly
    ? items.filter((item) => "isImportant" in item && item.isImportant)
    : items;

  return (
    <div>
      {type === "공지사항" && (
        <div className="my-2">
          <div className="flex items-center p-4 rounded-md bg-white shadow-md">
            <Checkbox
              checked={state.showImportantOnly}
              onCheckedChange={toggleImportantOnly}
            />
            <span className="ml-2 font-semibold">중요 항목만 보기</span>
          </div>
        </div>
      )}

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => {
          const createdAtKST = convertToKST(
            new Date(item.createdAt).toISOString()
          );
          const isExpanded = state.expandedFeed === item.id;
          const borderClass =
            "isImportant" in item && item.isImportant
              ? "border-2 border-red-200"
              : "border border-gray-100";

          return (
            <div
              key={item.id}
              className={`bg-white p-10 rounded-md shadow-md mb-2 ${borderClass}`}
            >
              <AuthorInfo
                profileImage={item.author.user.log.profileImage}
                name={item.author.user.name}
                position={item.author.position}
                isAuthor={projectUser.id === item.author.projectUserId}
                onEdit={() => handleUpdateModalOpen(item)}
                onDelete={() => console.log("삭제 기능 추가 예정")}
                type={type}
              />

              <hr className="my-4" />
              <div className="flex items-center">
                <p className="text-xl font-semibold">{item.title}</p>
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

              {type == "투표" && "voteOptions" in item && (
                <CommunityVoteOptions
                  voteOptions={item.voteOptions}
                  isAnonymous={item.isAnonymous}
                  isMultipleChoice={item.isMultipleChoice}
                  voteId={item.id}
                  projectId={projectId}
                />
              )}

              <FilePreview files={item.community_files || []} />
              {/* 작성일 */}
              <div className="flex items-center justify-between mt-8">
                <button className="text-gray-500 hover:underline text-sm">
                  <p className="text-sm text-gray-400">좋아요</p>
                </button>
                <p className="text-sm text-gray-400">
                  <TimeAgo date={new Date(createdAtKST)} />
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
    </div>
  );
}
