export interface ModalProps {
  label: string;
}

export interface ModalDetailProps extends ModalProps {
  closeModal: () => void;
}
