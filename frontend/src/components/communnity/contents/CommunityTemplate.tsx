import CommunityForm from "@/components/modal/CommunityForm";
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

export default function CommunityTemplate({
  onClose,
  type,
  items,
  projectUser,
  projectId,
}: CommunityTemplateProps) {
  const [expandedFeed, setExpandedFeed] = useState<null | string | number>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    Community | Notice | undefined
  >(undefined);

  const handleToggleExpand = (itemId: string | number) => {
    setExpandedFeed((prev) => (prev === itemId ? null : itemId));
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const toggleImportantOnly = () => {
    setShowImportantOnly((prev) => !prev);
  };

  const filteredItems = showImportantOnly
    ? items.filter((item) => "isImportant" in item && item.isImportant)
    : items;

  const handleEditClick = (item: Community | Notice) => {
    setSelectedItem(item);
    onClose();
  };

  return (
    <div>
      {/* 중요한 공지 필터 */}
      {type === "notice" && (
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
                          className="text-gray-500 hover:underline text-sm"
                          onClick={() => handleEditClick(item)}
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
                {type === "notice" &&
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

              {/* 작성일 */}
              <p className="flex w-full justify-end text-sm text-gray-400 my-4">
                {createdAtKST}
              </p>

              {/* 파일 처리 */}
              <div className="mt-4">
                {/* 이미지 파일 */}
                {imageFiles.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent className="flex">
                      {imageFiles.map((file, fileIndex) => (
                        <CarouselItem
                          key={`image-${fileIndex}`}
                          className="flex basis-1/4"
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
              </div>
            </div>
          );
        })
      ) : (
        <p>내용이 없습니다.</p>
      )}

      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />

      {selectedItem && (
        <CommunityForm
          isOpen={true}
          onClose={() => setSelectedItem(undefined)}
          type={type}
          feedId={selectedItem.id}
          projectId={projectId}
          mode="update"
          updateData={{
            title: selectedItem.title,
            content: selectedItem.content,
            community_files: selectedItem.community_files,
            isImportant:
              "isImportant" in selectedItem
                ? selectedItem.isImportant
                  ? "true"
                  : "false"
                : undefined,
          }}
        />
      )}
    </div>
  );
}
