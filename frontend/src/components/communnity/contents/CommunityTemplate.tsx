import { Checkbox } from "@/components/ui/checkbox";
import FileItem from "@/components/utils/FileItem";
import ImageModal from "@/components/utils/ImageModal";
import { isImageFile } from "@/components/utils/isImageFile";
import { CommunityTemplateProps } from "@/types/community";
import { convertToKST } from "@/utils/convertToKST";
import Image from "next/image";
import { useState } from "react";

export default function CommunityTemplate({
  type,
  items,
}: CommunityTemplateProps) {
  const [expandedFeed, setExpandedFeed] = useState<null | string | number>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(false);

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

  return (
    <div>
      {/* 중요한 공지 필터 */}
      {type === "notice" && (
        <div className="flex items-center my-4 justify-end">
          <Checkbox
            checked={showImportantOnly}
            onCheckedChange={toggleImportantOnly}
          />
          <span className="ml-2">중요 항목 보기</span>
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
              ? "border-l-4 border-red-300"
              : "border";

          const files = item.community_files || [];
          const imageFiles = files.filter((file) => isImageFile(file));
          const docsFiles = files.filter((file) => !isImageFile(file));

          return (
            <div
              key={index}
              className={`bg-white p-14 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mb-12 ${borderClass}`}
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
                    <p className="text-sm text-gray-500">{createdAtKST}</p>
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <hr className="my-4" />
              <p className="text-2xl font-semibold">{item.title}</p>
              <hr className="my-4" />

              {/* 내용 */}
              <div
                className="text-md text-gray-700 my-4 overflow-hidden transition-all duration-500"
                style={{ height: isExpanded ? "auto" : "100px" }}
              >
                {item.content}
              </div>
              {item.content.length > 200 && (
                <button
                  className="text-blue-500 font-medium my-2"
                  onClick={() => handleToggleExpand(item.id)}
                >
                  {isExpanded ? "간략히 보기" : "더보기"}
                </button>
              )}

              {/* 파일 처리 */}
              <div className="mt-4">
                {/* 이미지 파일 */}
                {imageFiles.map((file, fileIndex) => (
                  <div key={`image-${fileIndex}`} className="my-2">
                    <Image
                      src={file}
                      alt={`Attachment ${fileIndex + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(file)}
                    />
                  </div>
                ))}

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
    </div>
  );
}
