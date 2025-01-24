export interface FileItemProps {
  file: File;
}

export interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}
