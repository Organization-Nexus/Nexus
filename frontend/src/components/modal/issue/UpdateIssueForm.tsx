"use client";

import { useState } from "react";
import {
  Calendar1,
  Clock,
  GitBranch,
  Milestone,
  Tags,
  X,
  Text,
} from "lucide-react";
import { Modal } from "../config/ModalMaps";
import { UnderlineInput } from "@/components/ui/underlineInput";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";
import { Milestone as MilestoneType } from "@/types/milestone";
import { Issue, UpdateIssue } from "@/types/issue";
import { useUpdateIssue } from "@/query/mutations/issue";

interface UpdateIssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  milestone: MilestoneType;
  initialData: Issue;
}

export function UpdateIssueForm({
  isOpen,
  onClose,
  projectId,
  milestone,
  initialData,
}: UpdateIssueFormProps) {
  const updateIssueMutation = useUpdateIssue(projectId, milestone.id);

  const [formData, setFormData] = useState({
    title: initialData.title,
    content: initialData.content,
    category: initialData.category,
    label: initialData.label,
    branch: initialData.branch,
    expected_results: initialData.expected_results,
    start_date: initialData.start_date,
    end_date: initialData.end_date,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const labels = [
    { value: "feature", icon: "✨", text: "Feature" },
    { value: "refactor", icon: "🛠️", text: "Refactor" },
    { value: "bug", icon: "🐛", text: "Bug" },
    { value: "setting", icon: "⚙️", text: "Setting" },
    { value: "test", icon: "🧪", text: "Test" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!formData.content.trim()) newErrors.content = "내용을 입력해주세요.";
    if (!formData.branch.trim()) newErrors.branch = "브랜치명을 입력해주세요.";
    if (!formData.expected_results.trim())
      newErrors.expected_results = "예상되는 결과를 입력해주세요.";
    if (!formData.start_date) newErrors.start_date = "시작일을 입력해주세요.";
    if (!formData.end_date) newErrors.end_date = "마감일을 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});
    if (!validateForm()) return;

    try {
      const issueData: UpdateIssue = {
        ...formData,
        category: milestone.category,
      };

      updateIssueMutation.mutate({
        issueId: initialData.id,
        data: issueData,
      });
      console.log("이슈 수정 성공");
      onClose();
      alert("이슈가 수정되었습니다.");
    } catch (error) {
      console.error("이슈 수정 실패", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
      className="px-10 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-h-[79vh]"
      >
        <div className="flex flex-row justify-between mt-1">
          <p className="text-lg font-semibold text-custom-smallText">
            <Milestone className="inline text-custom-point mr-2" />
            {milestone.title} - 이슈 수정
          </p>
          <CustomAlertDialog
            onConfirm={onClose}
            title="수정을 취소할까요?"
            description="확인 버튼을 누르시면 수정 내용이 저장되지 않습니다."
          >
            <div className="flex justify-end items-center">
              <X className="cursor-pointer" />
            </div>
          </CustomAlertDialog>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* 제목 */}
          <div className="mt-4 mb-2">
            <UnderlineInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={50}
              placeholder="제목을 입력하세요."
              className="mx-2 p-0 border-b-0 font-semibold md:text-xl placeholder:text-[#BDBDBD]"
            />
            <hr className="border-0 border-b-2 border-custom-divider" />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.title}</p>
            )}
          </div>

          {/* 라벨 선택 */}
          <div className="flex mt-4 mx-2 items-center">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Tags className="mr-3 w-5 h-5" /> 라벨 선택
            </label>
            <span className="w-auto text-red-500 mr-9">*</span>
            {labels.map((label) => (
              <button
                key={label.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, label: label.value }))
                }
                className={`px-3 mr-2 py-[2px] mb-2 rounded-xl transition-colors flex items-center ${
                  formData.label === label.value
                    ? "bg-custom-point text-white"
                    : "bg-white text-custom-smallText border border-gray-300 hover:bg-gray-300 hover:text-white"
                }`}
              >
                <span className="mr-1">{label.icon}</span>
                {label.text}
              </button>
            ))}
          </div>
          <hr className="border-custom-divider" />

          {/* 시작일, 마감일 */}
          <div className="grid grid-cols-2 items-center mx-2">
            <div className="flex flex-row items-center">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <Calendar1 className="mr-3 w-5 h-5" /> 시작일
              </label>
              <span className="w-auto text-red-500">*</span>
              <UnderlineInput
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-auto border-b-0 p-0 ml-14 text-base font-semibold md:text-base placeholder:text-[#BDBDBD]"
              />
            </div>
            <div className="flex flex-row items-center">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <Clock className="mr-3 w-5 h-5" />
                예상 마감일
              </label>
              <span className="w-auto text-red-500">*</span>
              <UnderlineInput
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-auto border-b-0 p-0 ml-14 text-base font-semibold md:text-base placeholder:text-[#BDBDBD]"
              />
            </div>
          </div>
          <hr className="border-custom-divider" />
          <div className="grid grid-cols-2 items-center mr-2">
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1 ml-2">
                {errors.start_date}
              </p>
            )}
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1 ml-2">
                {errors.end_date}
              </p>
            )}
          </div>

          {/* 브랜치명 */}
          <div className="flex flex-row items-center mx-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <GitBranch className="mr-3 w-5 h-5" /> 브랜치명
            </label>
            <span className="w-auto text-red-500">*</span>
            <p className="ml-11 text-custom-point cursor-not-allowed">
              {formData.label}/이슈번호-{milestone.category}-
            </p>
            <UnderlineInput
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              maxLength={50}
              required
              placeholder="브랜치명을 입력하세요."
              className="flex-1 border-b-0 p-0 ml-2 text-base md:text-base placeholder:text-[#BDBDBD]"
            />
          </div>
          <hr className="border-custom-divider" />
          {errors.branch && (
            <p className="text-red-500 text-sm mt-1 ml-2">{errors.branch}</p>
          )}

          {/* 상세 내용 */}
          <div>
            <div className="flex flex-row items-center mx-2 mt-2">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <Text className="mr-3 w-5 h-5" /> 상세 내용
              </label>
              <span className="w-auto text-red-500">*</span>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요."
              className="w-full min-h-[8rem] m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] placeholder:font-semibold focus:outline-none"
              required
            />
            <hr className="border-custom-divider" />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.content}</p>
            )}
          </div>

          {/* 예상되는 결과 */}
          <div className="flex flex-row items-center mx-2 mt-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Text className="mr-3 w-5 h-5" /> 예상 결과
            </label>
            <span className="w-auto text-red-500">*</span>
          </div>
          <textarea
            name="expected_results"
            value={formData.expected_results}
            onChange={handleChange}
            placeholder="해당 이슈로 예상되는 결과를 입력하세요."
            className="w-full min-h-[5rem] m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] placeholder:font-semibold focus:outline-none"
            required
          />
          <hr className="border-custom-divider" />
          {errors.expected_results && (
            <p className="text-red-500 text-sm mt-1 ml-2">
              {errors.expected_results}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex space-x-2 justify-end mt-4">
          <CustomAlertDialog
            onConfirm={onClose}
            title="수정을 취소할까요?"
            description="확인 버튼을 누르시면 수정 내용이 저장되지 않습니다."
          >
            <Modal.Button variant="secondary">닫기</Modal.Button>
          </CustomAlertDialog>
          <Modal.Button variant="primary" onClick={handleSubmit}>
            수정
          </Modal.Button>
        </div>
      </form>
    </Modal>
  );
}
