export interface FileItemProps {
  file: string;
}

export interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}
