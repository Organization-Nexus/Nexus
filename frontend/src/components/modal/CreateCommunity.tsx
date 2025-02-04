import { CommunityModalProps } from "@/types/modal";
import { Modal } from "./config/ModalMaps";
import { useState } from "react";
import { MapPin, Paperclip, Siren, Trash2 } from "lucide-react";
import type { CreateCommunity } from "@/types/community";
import { useCreateFeed, useCreateNotice } from "@/query/mutations/community";

export default function CreateCommunity({
  isOpen,
  onClose,
  type,
  projectId,
}: CommunityModalProps) {
  const { mutate: CreateNoitce } = useCreateNotice(projectId);
  const { mutate: CreateFeed } = useCreateFeed(projectId);

  const [formData, setFormData] = useState<CreateCommunity>({
    title: "",
    content: "",
    community_files: [],
    isImportant: "false",
  });

  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

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
      if (files.length > 10) {
        setFileError("파일은 10개 이내로 첨부할 수 있습니다.");
      } else {
        setFileError("");
        setFormData((prev) => ({
          ...prev,
          community_files: [...prev.community_files, ...Array.from(files)],
        }));
      }
    }
  };

  const handleFileDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      community_files: prev.community_files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setTitleError("");
      setContentError("");

      if (!formData.title) {
        setTitleError("제목은 필수 입력입니다. 🚨");
        return;
      }
      if (!formData.content) {
        setContentError("설명은 필수 입력입니다. 🚨");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formData.community_files.forEach((file) =>
        formDataToSend.append("community_files", file)
      );

      if (type === "공지사항") {
        formDataToSend.append("isImportant", String(formData.isImportant));
        CreateNoitce(formDataToSend);
      } else if (type === "피드") {
        CreateFeed(formDataToSend);
      }
      onClose();
    } catch (error) {
      console.error("Create Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center">
        <Modal.Title>{type} 생성</Modal.Title>
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
          <span className="text-xs text-gray-400">
            파일은 10개 이내로 첨부할 수 있습니다.
          </span>
        </div>

        {/* 파일 첨부 목록 */}
        {formData.community_files.length > 0 && (
          <div className="space-y-2">
            <div className="space-y-1">
              {formData.community_files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleFileDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
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
              생성
            </Modal.Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
