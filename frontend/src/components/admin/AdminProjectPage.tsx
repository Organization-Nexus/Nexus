"use client";

import { Project } from "@/types/project";
import Image from "next/image";
import { useState } from "react";
import { Pencil } from "lucide-react";
import ConfirmModal from "../modal/ConfirmModal";
import { useUpdateProject, useDeleteProject } from "@/query/mutations/project";
import { useRouter } from "next/dist/client/components/navigation";

export default function AdminProjectPage({ project }: { project: Project }) {
  const router = useRouter();
  const defaultImage =
    typeof project.project_image === "string"
      ? project.project_image
      : "/placeholder-image.jpg";

  const initialState = {
    title: project.title || "프로젝트 제목",
    description: project.description || "프로젝트 설명이 여기에 들어갑니다.",
    project_image: defaultImage as string | File,
    start_date: project.start_date || "",
    end_date: project.end_date || "",
  };

  const [formData, setFormData] = useState(initialState);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [confirmStep, setConfirmStep] = useState<1 | 2>(1);
  const isModalOpen = modalType !== null;

  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  const openModal = (type: "edit" | "delete") => {
    setModalType(type);
    setConfirmStep(1);
  };

  const closeModal = () => {
    setModalType(null);
    setConfirmStep(1);
  };

  const handleConfirm = () => {
    if (modalType === "edit") {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);

      if (formData.project_image instanceof File) {
        data.append("project_image", formData.project_image);
      } else if (typeof formData.project_image === "string") {
        data.append("project_image", formData.project_image);
      }

      updateProject({
        projectId: project.id.toString(),
        projectData: data,
      });
      router.push(`/myproject`);
      router.refresh();
      closeModal();
    } else if (modalType === "delete") {
      if (confirmStep === 1) {
        setConfirmStep(2); // 한 번 더 확인으로 넘어감
      } else {
        // 실제 삭제 호출
        deleteProject(project.id.toString(), {
          onSuccess: () => {
            router.push("/myproject");
            router.refresh();
          },
        });
        closeModal();
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_date") {
      setFormData((prev) => ({
        ...prev,
        start_date: value,
        end_date: "",
      }));
    } else if (name === "end_date") {
      if (formData.start_date && value < formData.start_date) return;
      setFormData((prev) => ({
        ...prev,
        end_date: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        project_image: file,
      }));
    }
  };

  const resetField = (key: keyof typeof formData) => {
    if (key === "start_date") {
      setFormData((prev) => ({
        ...prev,
        start_date: initialState.start_date,
        end_date: initialState.end_date,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: initialState[key],
      }));
    }
  };

  const resetAll = () => {
    setFormData(initialState);
  };

  return (
    <div className="p-6 w-[90%] h-[75vh] bg-white overflow-y-scroll space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold">프로젝트 관리</h1>
        <button
          className="text-sm text-gray-600 hover:font-semibold"
          onClick={resetAll}
        >
          전체 초기화
        </button>
      </div>

      <hr className="my-4 border-gray-300" />

      <section className="space-y-6">
        {/* 제목 */}
        <div className="relative">
          <label className="font-semibold block mb-1">
            제목{" "}
            <span className="text-gray-400 text-xs">
              50자 이내로 작성해주세요.
            </span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
          />
          <button
            className="absolute top-0 right-0 text-xs text-gray-400 hover:text-black"
            onClick={() => resetField("title")}
          >
            초기화
          </button>
        </div>

        {/* 설명 */}
        <div className="relative">
          <label className="font-semibold block mb-1">
            설명{" "}
            <span className="text-gray-400 text-xs">
              100자 이내로 작성해주세요.
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none bg-gray-50"
          />
          <button
            className="absolute top-0 right-0 text-xs text-gray-400 hover:text-black"
            onClick={() => resetField("description")}
          >
            초기화
          </button>
        </div>

        {/* 이미지 */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <label className="font-semibold block mb-1">
              로고{" "}
              <span className="text-gray-400 text-xs">
                5mb 이하의 이미지로 작성해주세요.
              </span>
            </label>
            <button
              className="text-xs text-gray-400 hover:text-black"
              onClick={() => resetField("project_image")}
            >
              초기화
            </button>
          </div>
          <div className="relative w-[100px] h-[100px] mt-2">
            <Image
              src={
                formData.project_image instanceof File
                  ? URL.createObjectURL(formData.project_image)
                  : formData.project_image
              }
              alt={formData.title}
              fill
              className="rounded-md object-cover"
            />
            <label className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
              <Pencil className="w-4 h-4 text-red-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 날짜 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold block mb-1">날짜 선택</label>
            <button
              className="text-xs text-gray-400 hover:text-black"
              onClick={() => resetField("start_date")}
            >
              초기화
            </button>
          </div>

          {/* 시작일 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">시작일</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
          </div>

          {/* 종료일 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">종료일</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || undefined}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-6 text-sm">
          <button
            onClick={() => openModal("edit")}
            className="text-gray-800 hover:bg-blue-300 hover:text-white px-4 py-2 bg-blue-200 rounded-lg"
          >
            수정
          </button>
          <button
            onClick={() => openModal("delete")}
            className="text-gray-800 hover:bg-red-300 hover:text-white px-4 py-2 bg-red-200 rounded-lg"
          >
            삭제
          </button>
        </div>
      </section>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        message={
          modalType === "edit"
            ? "정말 수정하시겠습니까?"
            : confirmStep === 1
            ? "정말 삭제하시겠습니까?"
            : "삭제하시겠습니까?"
        }
        warningText={
          modalType === "delete" && confirmStep === 2
            ? "⚠ 이 작업은 되돌릴 수 없습니다."
            : undefined
        }
      />
    </div>
  );
}
