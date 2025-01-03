"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import CreateProjectModal from "../CreateProject";

const modalMap = {
  "프로젝트 생성": CreateProjectModal,
};

interface ModalMainProps {
  label: keyof typeof modalMap;
}

export default function ModalMain({ label }: ModalMainProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ModalComponent = modalMap[label];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{label}</Button>
      {isOpen && (
        <ModalComponent isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
