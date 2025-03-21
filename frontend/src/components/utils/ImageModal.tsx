import { ImageModalProps } from "@/types/utill";

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
}: ImageModalProps) {
  if (!isOpen || !imageUrl) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Enlarged"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}
