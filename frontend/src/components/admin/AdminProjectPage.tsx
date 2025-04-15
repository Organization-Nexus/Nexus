"use client";

import { Project } from "@/types/project";
import Image from "next/image";
import { useState } from "react";
import { Calendar, Pencil, Image as LogoImage } from "lucide-react";

export default function AdminProjectPage({ project }: { project: Project }) {
  const defaultImage =
    typeof project.project_image === "string"
      ? project.project_image
      : "/placeholder-image.jpg";

  const [formData, setFormData] = useState({
    title: project.title || "프로젝트 제목",
    description: project.description || "프로젝트 설명이 여기에 들어갑니다.",
    project_image: defaultImage,
    start_date: project.start_date || "",
    end_date: project.end_date || "",
  });

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
        project_image: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="p-6 w-[90%] h-[85vh] bg-white overflow-scroll">
      <h1 className="text-2xl font-bold">프로젝트 관리</h1>
      <hr className="my-4" />

      <section className="space-y-6">
        {/* 제목 */}
        <div>
          <label className="font-semibold">
            제목
            <span className="text-gray-400 font-normal text-xs ml-2">
              50자 이내로 작성해주세요.
            </span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="프로젝트 제목"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="font-semibold">
            설명
            <span className="text-gray-400 font-normal text-xs ml-2">
              100자 이내로 작성해주세요.
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="프로젝트 설명이 여기에 들어갑니다."
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={4}
          />
        </div>

        {/* 이미지 */}
        <div>
          <label className="font-semibold">
            <label className="font-semibold flex items-center gap-1">
              <LogoImage size={16} />
              로고
            </label>
            <span className="text-gray-400 font-normal text-xs ml-2">
              5MB 이하 : jpg, png, jpeg
            </span>
          </label>
          <div className="relative w-[100px] h-[100px] mt-2">
            <Image
              src={formData.project_image}
              alt={formData.title}
              fill
              className="rounded-md object-cover"
            />
            <label className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
              <Pencil size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="w-full space-y-4">
          {/* 시작일 */}
          <div className="w-1/2">
            <label className="font-semibold flex items-center gap-1">
              <Calendar size={16} />
              시작일
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* 종료일 */}
          <div className="w-1/2">
            <label className="font-semibold flex items-center gap-1">
              <Calendar size={16} />
              종료일
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || undefined}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
        {/* 버튼 */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            className="text-gray-600 hover:font-semibold"
            onClick={() =>
              setFormData({
                title: project.title || "프로젝트 제목",
                description:
                  project.description || "프로젝트 설명이 여기에 들어갑니다.",
                project_image:
                  typeof project.project_image === "string"
                    ? project.project_image
                    : "/placeholder-image.jpg",
                start_date: project.start_date || "",
                end_date: project.end_date || "",
              })
            }
          >
            초기화
          </button>
          <button className="text-red-600 hover:font-semibold">
            프로젝트 삭제
          </button>
          <button className="text-gray-800 hover:font-semibold">
            프로젝트 수정
          </button>
        </div>
      </section>
    </div>
  );
}
