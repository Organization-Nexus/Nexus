"use client";

import {
  useCreateFeed,
  useCreateNotice,
  useCreateVote,
} from "@/query/mutations/community";
import { CreateCommunity } from "@/types/modal";
import { useState } from "react";
import { isImageFile } from "../../utils/isImageFile";
import { Modal } from "../config/ModalMaps";
import { Paperclip, Siren, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import Image from "next/image";
import FileItem from "../../utils/FileItem";
import CreateVoteOptions from "@/components/modal/community/CreateVoteOptions";
import { CreateCommunityForm, CreateVoteDto } from "@/types/community";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";

export default function CreateCommunityModal({
  isOpen,
  onClose,
  type, // "feed" | "notice" | "vote"
  projectId,
}: CreateCommunity) {
  const createNoticeMutation = useCreateNotice(projectId);
  const createFeedMutation = useCreateFeed(projectId);
  const createVoteMutation = useCreateVote(projectId);

  const [formData, setFormData] = useState<CreateCommunityForm | CreateVoteDto>(
    {
      title: "",
      content: "",
      community_files: [],
      isImportant: type === "공지사항" ? "false" : undefined,
      isMultipleChoice: type === "투표" ? "false" : "",
      isAnonymous: type === "투표" ? "false" : "",
      deadline: type === "투표" ? null : "",
      options: type === "투표" ? [] : undefined,
    }
  );

  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [voteOptionError, setVoteOptionError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const imageFiles = Array.isArray(formData.community_files)
    ? formData.community_files.filter((file) => isImageFile(file))
    : [];
  const docsFiles = Array.isArray(formData.community_files)
    ? formData.community_files.filter((file) => !isImageFile(file))
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > 50) {
      setTitleError("제목은 50자 이내로 작성해주세요.");
    } else if (name === "content" && value.length > 2000) {
      setContentError("설명은 2000자 이내로 작성해주세요.");
    } else if (name === "options" && value.length < 2) {
      setVoteOptionError("투표 옵션은 최소 2개 이상 입력해야 합니다.");
    } else {
      if (name === "title") setTitleError("");
      if (name === "content") setContentError("");
      if (name === "options") setVoteOptionError("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const totalFiles =
        (formData.community_files?.length || 0) + selectedFiles.length;
      if (totalFiles > 10) {
        setFileError("파일은 최대 10개까지 첨부할 수 있습니다.");
        return;
      }
      setFileError("");
      setFormData((prev) => ({
        ...prev,
        community_files: [...(prev.community_files || []), ...selectedFiles],
      }));
    }
    setFileError("");
  };

  const handleFileDelete = (index: number) => {
    const updatedFiles =
      formData.community_files?.filter(
        (file, fileIndex) => fileIndex !== index
      ) || [];
    setFormData((prev) => ({
      ...prev,
      community_files: updatedFiles,
    }));
    setFileError("");
  };

  const toggleIsImportant = () => {
    setFormData((prev) => {
      if ("isImportant" in prev) {
        return {
          ...prev,
          isImportant: prev.isImportant === "true" ? "false" : "true",
        };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    const errors = {
      title: !formData.title.trim() ? "제목을 입력해주세요." : "",
      content: !formData.content.trim() ? "내용을 입력해주세요." : "",
      voteOptions:
        type === "투표" && (formData as CreateVoteDto).options?.length < 2
          ? "투표 옵션은 최소 2개 이상 입력해야 합니다."
          : "",
    };
    setTitleError(errors.title);
    setContentError(errors.content);
    setVoteOptionError(errors.voteOptions);
    if (errors.title || errors.content || errors.voteOptions) {
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formData.community_files?.forEach((file) =>
        formDataToSend.append("community_files", file)
      );
      if (type === "공지사항" && "isImportant" in formData) {
        formDataToSend.append("isImportant", formData.isImportant || "");
        createNoticeMutation.mutate(formDataToSend);
      } else if (type === "피드") {
        createFeedMutation.mutate(formDataToSend);
      } else if (type === "투표") {
        Object.entries({
          isMultipleChoice: (formData as CreateVoteDto).isMultipleChoice,
          isAnonymous: (formData as CreateVoteDto).isAnonymous,
          deadline: (formData as CreateVoteDto).deadline,
        }).forEach(([key, value]) => {
          if (value) formDataToSend.append(key, value);
        });
        (formData as CreateVoteDto).options.forEach((option) =>
          formDataToSend.append("options", option)
        );
        createVoteMutation.mutate(formDataToSend);
      }
      onClose();
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center">
        <Modal.Title>{type} 생성</Modal.Title>
        <CustomAlertDialog
          onConfirm={onClose}
          title="작성을 취소할까요?"
          description="확인 버튼을 누르시면 작성 내용이 저장되지 않습니다."
        >
          <Modal.Button variant="nothing">X</Modal.Button>
        </CustomAlertDialog>
      </div>
      <Modal.Divider />
      <Modal.Subtitle>{type}을 생성해주세요. 🤟</Modal.Subtitle>
      {type === "투표" && (
        <p className="text-xs text-red-500">
          투표는 모든사항이 수정 불가능 합니다.
        </p>
      )}
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
          className="w-full h-40 p-2 border rounded resize-none placeholder:text-sm placeholder:gray-400"
        />
        {contentError && (
          <span className="text-red-500 text-sm">{contentError}</span>
        )}

        {/* 투표 옵션 선택해버리기 */}
        {type === "투표" && (
          <CreateVoteOptions
            formData={formData as CreateVoteDto}
            setFormData={
              setFormData as React.Dispatch<React.SetStateAction<CreateVoteDto>>
            }
            voteOptionError={voteOptionError}
          />
        )}

        <div className="flex items-center">
          <span className="block text-lg font-bold text-gray-700 pr-2">
            첨부 파일
          </span>

          <div className="flex items-center">
            <span className="text-xs text-gray-400">
              파일은 10개 이내로 첨부할 수 있습니다. (
              <span className="text-blue-500 font-semibold">
                {formData.community_files?.length || 0}
              </span>
              /10)
            </span>
            {formData.community_files?.length === 10 && fileError && (
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
                  <CarouselItem key={index} className="relative flex-none">
                    <Image
                      src={
                        file instanceof File ? URL.createObjectURL(file) : file
                      }
                      alt={`Attachment ${index + 1}`}
                      width={170}
                      height={170}
                      className="rounded-lg max-w-[170px] max-h-[170px]"
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

            {/* 중요 사항 */}
            {type === "공지사항" && (
              <button
                type="button"
                onClick={toggleIsImportant}
                className={`${
                  "isImportant" in formData && formData.isImportant === "true"
                    ? "text-red-500"
                    : ""
                }`}
              >
                <Siren size={25} />
              </button>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-2">
            <CustomAlertDialog
              onConfirm={onClose}
              title="작성을 취소할까요?"
              description="확인 버튼을 누르시면 작성 내용이 저장되지 않습니다."
            >
              <Modal.Button variant="secondary">닫기</Modal.Button>
            </CustomAlertDialog>
            <Modal.Button variant="primary" onClick={handleSubmit}>
              생성
            </Modal.Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
