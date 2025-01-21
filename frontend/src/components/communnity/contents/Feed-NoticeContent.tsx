import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FileItem from "@/components/utils/FileItem";
import ImageModal from "@/components/utils/ImageModal";
import Loading from "@/components/utils/Loading";
import { Community } from "@/types/community";
import { convertToKST } from "@/utils/convertToKST";
import { isImageFile } from "@/utils/isImageFile";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FeedsContent({ feeds }: { feeds: Community[] }) {
  const [expandedFeed, setExpandedFeed] = useState<null | string | number>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clientTime, setClientTime] = useState<string | null>(null);

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
    <div>
      {feeds.length > 0 ? (
        feeds.map((feed) => {
          const createdAtKST = convertToKST(
            new Date(feed.createdAt).toISOString()
          );
          const files = feed.community_files || [];
          const imageFiles: string[] = files.filter(isImageFile);
          const documentFiles: string[] = files.filter(
            (file) => !isImageFile(file)
          );

          const contentMaxHeight = "100px";

          return (
            <div
              key={feed.id}
              className="bg-white p-14 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mb-2"
            >
              <div className="flex items-start space-x-4">
                <Image
                  src={feed.author?.user?.log.profileImage}
                  alt={feed.author?.user?.log.profileImage}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-semibold">
                        {feed.author?.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {feed.author?.position}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{createdAtKST}</p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />
              <div className="text-xl font-bold mt-4">{feed.title}</div>
              <hr className="my-4" />

              <div
                className="text-md text-gray-700 my-4 overflow-hidden transition-all duration-500"
                style={{
                  height: expandedFeed === feed.id ? "auto" : contentMaxHeight,
                }}
              >
                {feed.content}
              </div>

              {feed.content.length > 200 && (
                <button
                  className="text-blue-500 font-medium my-2"
                  onClick={() => handleToggleExpand(feed.id)}
                >
                  {expandedFeed === feed.id ? "간략히 보기" : "더보기"}
                </button>
              )}
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

              {documentFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {documentFiles.map((file, index) => (
                    <FileItem key={index} file={file} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">피드가 없습니다.</p>
      )}

      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
}
