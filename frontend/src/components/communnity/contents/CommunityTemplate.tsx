import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import FileItem from "@/components/utils/FileItem";
import ImageModal from "@/components/utils/ImageModal";
import { isImageFile } from "@/components/utils/isImageFile";
import { Community, CommunityTemplateProps, Notice } from "@/types/community";
import { convertToKST } from "@/utils/convertToKST";
import Image from "next/image";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import UpdateCommunityModal from "@/components/modal/community/UpdateCommunityModal";

export default function CommunityTemplate({
  type,
  items,
  projectUser,
  projectId,
}: CommunityTemplateProps) {
  const [expandedFeed, setExpandedFeed] = useState<null | string | number>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    Community | Notice | undefined
  >(undefined);

  console.log("😡 ITEMS", items);

  const handleToggleExpand = (itemId: string | number) => {
    setExpandedFeed((prev) => (prev === itemId ? null : itemId));
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const toggleImportantOnly = () => {
    setShowImportantOnly((prev) => !prev);
  };

  const handleUpdateModalOpen = (item: Community | Notice) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setSelectedItem(undefined);
    setIsUpdateModalOpen(false);
  };

  const filteredItems = showImportantOnly
    ? items.filter((item) => "isImportant" in item && item.isImportant)
    : items;

  return (
    <div>
      {/* 중요한 공지 필터 */}
      {type === "공지사항" && (
        <div className="flex items-center my-4 justify-end">
          <Checkbox
            checked={showImportantOnly}
            onCheckedChange={toggleImportantOnly}
          />
          <span className="ml-2">중요 항목만 보기</span>
        </div>
      )}

      {/* 리스트 렌더링 */}
      {filteredItems && filteredItems.length > 0 ? (
        filteredItems.map((item, index) => {
          const createdAtKST = convertToKST(
            new Date(item.createdAt).toISOString()
          );
          const timeAgo = formatDistanceToNow(createdAtKST, {
            addSuffix: true,
          });
          const isExpanded = expandedFeed === item.id;
          const borderClass =
            "isImportant" in item && item.isImportant
              ? "border-2 border-red-200"
              : "border border-gray-100";

          const files = item.community_files || [];
          const imageFiles = files.filter((file) => isImageFile(file));
          const docsFiles = files.filter((file) => !isImageFile(file));

          return (
            <div
              key={index}
              className={`p-14 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl mb-4 ${borderClass}`}
            >
              {/* 작성자 정보 */}
              <div className="flex items-start space-x-4">
                <Image
                  src={item.author.user.log.profileImage}
                  alt={item.author.user.name}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-semibold">
                        {item.author.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.author.position}
                      </p>
                    </div>
                    {projectUser.id === item.author.projectUserId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateModalOpen(item)}
                          className="text-gray-500 hover:underline text-sm"
                        >
                          수정
                        </button>

                        <button className="text-gray-500 hover:underline text-sm">
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <hr className="my-4" />
              <div className="flex items-center">
                {type === "공지사항" &&
                  "isImportant" in item &&
                  item.isImportant && (
                    <p className="mr-2 text-red-500">(중요)</p>
                  )}
                <p className="text-xl font-semibold">{item.title}</p>
              </div>
              <hr className="my-4" />

              {/* 내용 */}
              <div
                className="text-md text-gray-700 my-2 overflow-hidden transition-all duration-500"
                style={{ height: isExpanded ? "auto" : "50px" }}
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

              {/* 투표 항목 */}
              {"voteOptions" in item &&
                item.voteOptions &&
                item.voteOptions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {!item.isAnonymous && !item.isMultipleChoice && (
                        <div className="text-sm text-gray-300">
                          <p>
                            단일 투표입니다. 한 개의 항목만 선택 가능합니다.
                          </p>
                        </div>
                      )}

                      {item.isMultipleChoice && (
                        <div className="text-sm text-gray-300">
                          <p>다중 선택이 가능합니다.</p>
                        </div>
                      )}

                      {item.isAnonymous && (
                        <div className="text-sm text-gray-300">
                          <p>
                            익명 투표입니다. 선택한 항목은 다른 사용자에게
                            표시되지 않습니다.
                          </p>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {item.voteOptions.map((option, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center p-4 bg-gray-50 border rounded-md shadow-md hover:bg-green-50 hover:text-white ${
                            option.isSelectedByUser ? "bg-green-100" : ""
                          }`}
                        >
                          <span
                            className={`ml-2 ${
                              option.isSelectedByUser
                                ? "text-gray-700"
                                : "text-gray-700"
                            }`}
                          >
                            {option.content}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 파일 처리 */}
              <div className="mt-4">
                {/* 이미지 파일 */}
                {imageFiles.length > 0 && (
                  <Carousel className="w-[95%]">
                    <CarouselContent className="flex">
                      {imageFiles.map((file, fileIndex) => (
                        <CarouselItem
                          key={`image-${fileIndex}`}
                          className="relative flex-none"
                        >
                          <Image
                            src={file}
                            alt={`Attachment ${fileIndex + 1}`}
                            width={170}
                            height={170}
                            className="rounded-lg cursor-pointer object-cover max-w-[170px] max-h-[170px]"
                            onClick={() => handleImageClick(file)}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
                {/* 문서 파일 */}
                {docsFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {docsFiles.map((file, index) => (
                      <FileItem key={index} file={file} />
                    ))}
                  </div>
                )}
                {/* 작성일 */}
                <div className="flex items-center justify-between mt-8">
                  <button className="text-gray-500 hover:underline text-sm">
                    <p className="text-sm text-gray-400">좋아요</p>
                  </button>
                  <p className="text-sm text-gray-400">{timeAgo}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>내용이 없습니다.</p>
      )}

      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
      />

      {selectedItem && (
        <UpdateCommunityModal
          type={type}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          projectId={projectId}
          feedId={selectedItem.id.toString()}
          updateData={{
            ...selectedItem,
            community_files: selectedItem?.community_files ?? undefined,
          }}
        />
      )}
    </div>
  );
}
