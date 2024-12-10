"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";

interface ModalProps {
  onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleCreateProject = () => {
    console.log("Project Created", {
      projectTitle,
      description,
      startDate,
      endDate,
      logo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Project</h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="p-2"
          >
            <FiX />
          </Button>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold">
              제목 <span className="text-red-500">*</span>
              <span className="text-gray-300 text-[10px] font-normal ml-2">
                프로젝트 제목을 입력하세요. (최대 10자)
              </span>
            </label>

            <input
              id="title"
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 text-sm rounded mt-2"
              placeholder="제목을 입력하세요."
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-semibold"
            >
              설명
              <span className="text-gray-300 text-[10px] font-normal ml-2">
                프로젝트 설명에 관해 입력하세요. (최대 100자)
              </span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 text-sm rounded mt-2"
              placeholder="설명을 입력하세요."
              style={{ height: "150px", resize: "none" }} // height 고정, 크기 조절 비활성화
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold">
              시작일 <span className="text-red-500">*</span>
              <span className="text-gray-300 text-[10px] font-normal ml-2">
                추후 수정 가능
              </span>
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold">
              마감일 <span className="text-red-500">*</span>{" "}
              <span className="text-gray-300 text-[10px] font-normal ml-2">
                추후 수정 가능
              </span>
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
              min={startDate}
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-lg font-semibold">
              로고{" "}
              <span className="text-gray-300 text-[10px] font-normal ml-2">
                권장 사양 : - 400*100px, PNG / 최대 500KB
              </span>
            </label>

            <input
              id="logo"
              type="file"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              onChange={(e) =>
                setLogo(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" onClick={handleCreateProject}>
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
}
