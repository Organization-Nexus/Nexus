import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FileItem from "@/components/utils/FileItem";
import ImageModal from "@/components/utils/ImageModal";
import { isImageFile } from "@/components/utils/isImageFile";

interface FilePreviewProps {
  files: string[];
}

export default function FilePreview({ files }: FilePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const imageFiles = files.filter((file) => isImageFile(file));
  const docsFiles = files.filter((file) => !isImageFile(file));

  return (
    <div className="mt-4">
      {/* 이미지 파일 Carousel */}
      {imageFiles.length > 0 && (
        <Carousel className="w-[95%]">
          <CarouselContent className="flex">
            {imageFiles.map((file, index) => (
              <CarouselItem
                key={`image-${index}`}
                className="relative flex-none"
              >
                <Image
                  src={file}
                  alt={`Attachment ${index + 1}`}
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

      {/* 문서 파일 리스트 */}
      {docsFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          {docsFiles.map((file, index) => (
            <FileItem key={index} file={file} />
          ))}
        </div>
      )}

      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
      />
    </div>
  );
}
