"use client";

import React, { useState, useEffect } from "react";
import { FeedNoticeListProps } from "@/types/feed";
import { convertToKST } from "@/utils/convertToKST";
import { isImageFile } from "@/utils/isImageFile";
import FileItem from "@/components/utils/FileItem";
import Loading from "@/components/utils/Loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageModal from "@/components/utils/ImageModal";

function FeedNoticeList({ feeds }: FeedNoticeListProps) {
  const [expandedFeed, setExpandedFeed] = useState<null | string | number>(
    null
  );
  const [clientTime, setClientTime] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const currentDate = new Date();
    const kstTime = convertToKST(currentDate.toISOString());
    setClientTime(kstTime);
  }, []);

  const handleToggleExpand = (feedId: string | number) => {
    setExpandedFeed((prev) => (prev === feedId ? null : feedId));
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (!clientTime) return <Loading />;

  return (
    <div className="">
      {feeds.map((feed) => {
        const createdAtKST = convertToKST(
          new Date(feed.createdAt).toISOString()
        );
        const files = feed.feed_files || [];
        const imageFiles = files.filter((file) => isImageFile(file));
        const documentFiles = files.filter((file) => !isImageFile(file));

        const contentMaxHeight = "100px";

        return (
          <div
            key={feed.id}
            className="p-12 border shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 mb-2"
          >
            {/* Author Information */}
            {feed.author && (
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={feed.author.user.log.profileImage}
                    alt={feed.author.user.name}
                    className="w-16 h-16 rounded-md"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {feed.author.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {feed.author.position}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{createdAtKST}</p>
              </div>
            )}

            <hr className="border-gray-300 my-4" />
            <h2 className="text-2xl font-bold text-gray-900">{feed.title}</h2>
            <hr className="border-gray-300 my-4" />

            {/* 피드 내용 */}
            <div
              className="text-lg text-gray-700 my-4 overflow-hidden transition-all duration-300"
              style={{
                height: expandedFeed === feed.id ? "auto" : contentMaxHeight,
              }}
            >
              {feed.content}
            </div>

            {/* 더보기 버튼 */}
            {feed.content.length > 200 && (
              <button
                className="text-blue-500 mt-2"
                onClick={() => handleToggleExpand(feed.id)}
              >
                {expandedFeed === feed.id ? "간략히 보기" : "더보기"}
              </button>
            )}

            {/* 이미지 파일 렌더링 */}
            {imageFiles.length > 0 && (
              <div className="space-y-4 mb-4">
                <Carousel>
                  <CarouselPrevious />
                  <CarouselContent>
                    {imageFiles.map((file, index) => (
                      <CarouselItem key={index} className="basis-1/3.5">
                        <div className="w-full h-52">
                          <img
                            src={file}
                            alt={`${index}`}
                            className="object-cover w-full h-full transition-all duration-300 hover:scale-105 cursor-pointer"
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

            {/* 문서 파일 렌더링 */}
            {documentFiles.length > 0 && (
              <div className="space-y-2">
                {documentFiles.map((file, index) => (
                  <FileItem key={index} file={file} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default FeedNoticeList;
