"use client";

import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

interface ModalButtonProps {
  label: string;
}

const ModalButton = ({ label }: ModalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        {label}
      </button>
      {isModalOpen && <CreateProjectModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ModalButton;
