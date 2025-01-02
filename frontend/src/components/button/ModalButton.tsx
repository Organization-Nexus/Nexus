"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import CreateProjectModal from "../project/CreateProjectModal";
import { ModalProps } from "@/types/modal";

export default function ModalButton({ label }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{label}</Button>
      <CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
