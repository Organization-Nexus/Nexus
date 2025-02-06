import { CommunityModalProps } from "@/types/modal";
import { Modal } from "./config/ModalMaps";
import { useEffect, useState } from "react";
import { MapPin, Paperclip, Siren, Trash2 } from "lucide-react";
import type { CommunityFormData } from "@/types/community";
import {
  useCreateFeed,
  useCreateNotice,
  useUpdateCommunity,
} from "@/query/mutations/community";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import FileItem from "../utils/FileItem";
import { isImageFile } from "../utils/isImageFile";

export default function CommunityForm({
  isOpen,
  onClose,
  type,
  projectId,
  feedId,
  mode, // 'create' | 'update'
  updateData,
}: CommunityModalProps) {
  const createNoticeMutation = useCreateNotice(projectId);
  const createFeedMutation = useCreateFeed(projectId);
  const updateCommunityMutation = useUpdateCommunity(projectId, feedId!);

  const [formData, setFormData] = useState<CommunityFormData>({
    title: "",
    content: "",
    community_files: [],
    isImportant: "false",
  });

  useEffect(() => {
    if (mode === "update" && updateData) {
      setFormData({
        title: updateData.title,
        content: updateData.content,
        community_files: updateData.community_files as File[] | string[],
        isImportant: updateData.isImportant || "false",
      });
    }
  }, [mode, updateData]);

  const existingFiles =
    mode === "update" && updateData?.community_files
      ? updateData.community_files.filter((file) => typeof file === "string")
      : [];
  const newFiles = Array.isArray(formData.community_files)
    ? formData.community_files.filter((file) => file instanceof File)
    : [];

  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const imageFiles = Array.isArray(formData.community_files)
    ? formData.community_files.filter((file) => isImageFile(file))
    : [];
  const docsFiles = Array.isArray(formData.community_files)
    ? formData.community_files.filter((file) => !isImageFile(file))
    : [];
  const toggleIsImportant = () => {
    setFormData((prev) => ({
      ...prev,
      isImportant: prev.isImportant === "true" ? "false" : "true",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      if (value.length > 50) {
        setTitleError("제목은 50자 이내로 작성해주세요.");
      } else {
        setTitleError("");
      }
    }
    if (name === "content") {
      if (value.length > 2000) {
        setContentError("설명은 2000자 이내로 작성해주세요.");
      } else {
        setContentError("");
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const totalFiles = formData.community_files.length + newFiles.length;

      if (totalFiles > 10) {
        setFileError("파일은 최대 10개까지 첨부할 수 있습니다.");
        return;
      }

      setFileError("");
      setFormData((prev) => ({
        ...prev,
        community_files: [...(prev.community_files as File[]), ...newFiles],
      }));
    }
  };

  const handleFileDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      community_files: (prev.community_files as File[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);

      // 새 파일 업로드
      newFiles.forEach((file) => {
        formDataToSend.append("community_files", file as Blob);
      });

      // 기존 파일 URL을 유지하는 경우
      existingFiles.forEach((file) => {
        if (typeof file === "string") {
          formDataToSend.append("community_files", file);
        }
      });

      if (mode === "update") {
        updateCommunityMutation.mutate(formDataToSend, {
          onError: (error: any) => {
            console.error("수정 실패", error.response?.data || error);
          },
        });
      } else {
        if (type === "공지사항") {
          formDataToSend.append(
            "isImportant",
            formData.isImportant ? "true" : "false"
          );
          createNoticeMutation.mutate(formDataToSend);
        } else {
          createFeedMutation.mutate(formDataToSend);
        }
      }

      onClose();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center">
        <Modal.Title>
          {type} {mode === "create" ? "생성" : "수정"}
        </Modal.Title>
        <Modal.Button variant="nothing" onClick={onClose}>
          X
        </Modal.Button>
      </div>
      <Modal.Divider />
      <Modal.Subtitle>{type}을 등록해주세요. 👋</Modal.Subtitle>
      <Modal.Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div className="flex items-center">
          <label className="block text-lg font-bold text-gray-700 pr-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">
            50자 이내로 작성해주세요. (필수)
          </span>
        </div>
        <Modal.Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요."
          className="placeholder:text-sm placeholder:gray-400"
          required
        />
        {titleError && (
          <span className="text-red-500 text-sm">{titleError}</span>
        )}

        {/* 내용 */}
        <div className="flex items-center">
          <label className="block text-lg font-bold text-gray-700 pr-2">
            설명 <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">
            2000자 이내로 작성해주세요. (필수)
          </span>
        </div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="설명을 입력하세요."
          className="w-full h-52 p-2 border rounded resize-none placeholder:text-sm placeholder:gray-400"
          required
        />
        {contentError && (
          <span className="text-red-500 text-sm">{contentError}</span>
        )}

        <div className="flex items-center">
          <span className="block text-lg font-bold text-gray-700 pr-2">
            첨부 파일
          </span>

          <div className="flex items-center">
            <span className="text-xs text-gray-400">
              파일은 10개 이내로 첨부할 수 있습니다. (
              <span className="text-blue-500 font-semibold">
                {formData.community_files.length}
              </span>
              /10)
            </span>
            {formData.community_files.length === 10 && fileError && (
              <span className="ml-2 text-red-500 text-sm">
                🚨 {fileError} 🚨
              </span>
            )}
          </div>
        </div>

        {/* 파일 첨부 목록 */}
        {imageFiles.length > 0 && (
          <div className="w-full flex justify-center">
            <Carousel className="w-[95%]">
              <CarouselContent className="flex">
                {imageFiles.map((file, index) => (
                  <CarouselItem
                    key={index}
                    className="relative flex items-center justify-center flex-none w-[170px]"
                  >
                    <Image
                      src={
                        file instanceof File ? URL.createObjectURL(file) : file
                      }
                      alt={`Attachment ${index + 1}`}
                      width={170}
                      height={170}
                      className="rounded-lg cursor-pointer object-cover max-w-[170px] max-h-[170px]"
                    />
                    <button
                      onClick={() => handleFileDelete(index)}
                      className="absolute top-2 right-2 bg-white bg-opacity-50 p-1 rounded-full text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
        {docsFiles.length > 0 && (
          <div className="space-y-2 mt-4">
            {docsFiles.map((file, index) => (
              <div key={index} className="relative">
                <FileItem file={file} />
                <button
                  onClick={() => handleFileDelete(index + imageFiles.length)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-1 rounded-full text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Modal.Divider />

        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-4">
            {/* 파일 첨부 */}
            <button
              type="button"
              onClick={() =>
                document.getElementById("community_files")?.click()
              }
            >
              <Paperclip size={25} />
            </button>
            <input
              type="file"
              id="community_files"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />

            {/* 장소 첨부 */}
            <MapPin size={25} />

            {/* 중요 사항 */}
            {type === "공지사항" && (
              <button
                type="button"
                onClick={toggleIsImportant}
                className={`${
                  formData.isImportant === "true" ? "text-red-500" : ""
                }`}
              >
                <Siren size={25} />
              </button>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-2">
            <Modal.Button variant="secondary" onClick={onClose}>
              닫기
            </Modal.Button>
            <Modal.Button variant="primary" onClick={handleSubmit}>
              {mode === "create" ? "생성" : "수정"}
            </Modal.Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
