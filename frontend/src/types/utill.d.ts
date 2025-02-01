export interface FileItemProps {
  file: string | File;
}

export interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}
