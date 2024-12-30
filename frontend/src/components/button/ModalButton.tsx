"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import CreateProjectModal from "../project/CreateProjectModal";
import { ModalProps } from "@/types/modal";

function ModalButton({ label }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={openModal}>{label}</Button>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <CreateProjectModal label={label} closeModal={closeModal} />
          </div>
        </>
      )}
    </>
  );
}

export default ModalButton;
