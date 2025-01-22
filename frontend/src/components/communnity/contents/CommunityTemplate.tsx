import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FileItem from "@/components/utils/FileItem";
import ImageModal from "@/components/utils/ImageModal";
import { CommunityTemplateProps } from "@/types/community";
import { convertToKST } from "@/utils/convertToKST";
import { isImageFile } from "@/utils/isImageFile";
import Image from "next/image";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CommunityTemplate({ items }: CommunityTemplateProps) {
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

  return (
    <div>
      {items && items.length > 0 ? (
        items.map((item, index) => {
          if (!item.community) return <p key={index}>내용이 없습니다.</p>;

          const createdAtKST = convertToKST(
            new Date(item.community.createdAt).toISOString()
          );

          const files = item.community.community_files || [];
          const imageFiles: string[] = files.filter(isImageFile);
          const documentFiles: string[] = files.filter(
            (file) => !isImageFile(file)
          );

          const contentMaxHeight = "100px";

          const borderClass =
            item.type === "notice" && item.community.isImportant
              ? "border-4 border-red-300"
              : "border";

          return (
            <>
              {item.type === "notice" && item.community.isImportant && (
                <div className="flex items-center my-4 justify-end">
                  <Checkbox
                    checked={showImportantOnly}
                    onCheckedChange={toggleImportantOnly}
                  />
                  <span className="ml-2">중요 항목 보기</span>
                </div>
              )}

              {showImportantOnly &&
              item.type === "notice" &&
              !item.community.isImportant ? (
                <></>
              ) : (
                <div
                  key={index}
                  className={`bg-white p-14 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mb-2 ${borderClass}`}
                >
                  <div className="flex items-start space-x-4">
                    <Image
                      src={item.community.author?.user?.log.profileImage}
                      alt={item.community.author?.user?.name}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-semibold">
                            {item.community.author?.user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.community.author?.position}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{createdAtKST}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center space-x-4">
                    <p className="text-2xl font-semibold">
                      {item.community.title}
                    </p>
                    {item.type === "notice" && item.community.isImportant && (
                      <span className="text-xl mr-2 text-red-400">[중요]</span>
                    )}
                  </div>

                  <hr className="my-4" />
                  <div
                    className="text-md text-gray-700 my-4 overflow-hidden transition-all duration-500"
                    style={{
                      height:
                        expandedFeed === item.community.id
                          ? "auto"
                          : contentMaxHeight,
                    }}
                  >
                    {item.community.content}
                  </div>

                  {item.community.content.length > 200 && (
                    <button
                      className="text-blue-500 font-medium my-2"
                      onClick={() => handleToggleExpand(item.community.id)}
                    >
                      {expandedFeed === item.community.id
                        ? "간략히 보기"
                        : "더보기"}
                    </button>
                  )}

                  {/* 이미지 파일 처리 */}
                  {imageFiles.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <Carousel>
                        <CarouselPrevious />
                        <CarouselContent>
                          {imageFiles.map((file, index) => (
                            <CarouselItem key={index} className="basis-1/3">
                              <div className="w-full h-52 relative">
                                <img
                                  src={file}
                                  alt={`Image ${index}`}
                                  className="object-cover w-full h-full transition-all duration-300 hover:scale-105 cursor-pointer rounded-lg"
                                  onClick={() => handleImageClick(file)}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselNext />
                      </Carousel>
                    </div>
                  )}

                  {/* 문서 파일 처리 */}
                  {documentFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {documentFiles.map((file, index) => (
                        <FileItem key={index} file={file} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })
      ) : (
        <p>내용이 없습니다.</p>
      )}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
}
