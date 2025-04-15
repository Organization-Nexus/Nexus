"use client";
import { Modal } from "./config/ModalMaps";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  warningText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  warningText,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
      className="w-[450px] rounded-xl"
    >
      <Modal.Title className="text-base font-normal place-self-center mb-0 mt-4">
        {message}
        {warningText && (
          <p className="text-sm text-red-600 font-semibold mt-2">
            {warningText}
          </p>
        )}
      </Modal.Title>
      <div className="grid grid-cols-2 justify-items-stretch p-4 pb-0">
        <Modal.Button
          variant="secondary"
          onClick={onClose}
          className="text-sm w-full m-1"
        >
          취소
        </Modal.Button>

        <Modal.Button
          variant="primary"
          onClick={onConfirm}
          className="text-sm w-full m-1"
        >
          확인
        </Modal.Button>
      </div>
    </Modal>
  );
}
