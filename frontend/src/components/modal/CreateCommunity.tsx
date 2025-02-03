import { CommunityModalProps } from "@/types/modal";
import { Modal } from "./config/ModalMaps";
import { MapPin, Paperclip, Siren } from "lucide-react";
import { useState, useRef } from "react";
import type {
  Notice,
  Author,
  CreateCommunity,
  Community,
} from "@/types/community";
import { validateFile } from "@/utils/validators/fileValdiation";
import { useCreateFeed, useCreateNotice } from "@/query/mutations/community";

export default function CreateCommunity({
  isOpen,
  onClose,
  type,
  projectId,
}: CommunityModalProps) {
  const [formData, setFormData] = useState<CreateCommunity | Notice>({
    id: 0,
    title: "",
    content: "",
    community_files: [] as File[],
    createdAt: new Date().toISOString(),
    author: {} as Author,
    isImportant: false,
  });
  const { mutate: createNotice } = useCreateNotice(projectId);
  const { mutate: createFeed } = useCreateFeed(projectId);
  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  // 파일 input 참조
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 제목, 내용 변경 처리
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

  // 파일 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const errorMessage = validateFile(file, files);
      if (errorMessage) {
        setFileError(errorMessage);
        return;
      }
      setFileError("");
      setFormData((prev) => {
        const updatedFiles = Array.from(files);
        return {
          ...prev,
          community_files: updatedFiles,
          isImportant: (prev as Notice).isImportant ?? false,
        };
      });
    }
  };

  // 파일 첨부 버튼 클릭
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // 폼 제출
  const handleSubmit = async () => {
    try {
      setTitleError("");
      setContentError("");
      setFileError("");
      if (!formData.title || formData.title.length > 50) {
        setTitleError("제목은 50자 이내로 작성해주세요. 🚨");
        return;
      }
      if (!formData.content || formData.content.length > 2000) {
        setContentError("설명은 2000자 이내로 작성해주세요. 🚨");
        return;
      }

      const formDataToSend = {
        title: formData.title,
        content: formData.content,
        community_files: formData.community_files?.map((file) =>
          typeof file === "string" ? file : URL.createObjectURL(file)
        ),
        isImportant: (formData as Notice).isImportant ?? false,
      };

      if (type === "피드") {
        createFeed({
          ...formDataToSend,
          author: formData.author,
          id: (formData as Community).id,
          createdAt: (formData as Community).createdAt,
        });
      } else if (type === "공지사항") {
        createNotice({
          ...formDataToSend,
          id: (formData as Notice).id,
          createdAt: (formData as Notice).createdAt,
          author: formData.author,
        });
      }
      onClose();
    } catch (err) {
      setFileError("커뮤니티 생성에 실패했습니다.");
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
        {/* 제목 입력 */}
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
          placeholder="제목을 입력하세요"
          className="placeholder:text-sm placeholder:gray-400"
          required
        />
        {titleError && (
          <span className="text-red-500 text-sm">{titleError}</span>
        )}

        {/* 내용 입력 */}
        <div>
          <div className="flex items-center">
            <label className="block text-lg font-bold text-gray-700 pr-2">
              설명
            </label>
            <span className="text-xs text-gray-400">
              2000자 이내로 작성해주세요. (선택)
            </span>
          </div>
          <Modal.Input
            type="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="h-24 resize-none placeholder:text-sm placeholder:gray-400"
            placeholder="내용을 입력해주세요."
          />
          {contentError && (
            <span className="text-red-500 text-sm">{contentError}</span>
          )}
        </div>

        {/* 파일 첨부 */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-4">
            <button type="button" onClick={handleFileClick}>
              <Paperclip size={25} />
            </button>
            <MapPin size={25} />
            {type === "공지사항" && <Siren size={25} />}
            <input
              type="file"
              ref={fileInputRef}
              id="community_files"
              onChange={handleFileChange}
              className="hidden"
            />
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
