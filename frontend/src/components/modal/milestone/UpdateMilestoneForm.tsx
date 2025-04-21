"use client";

import { useState } from "react";

import {
  Calendar1,
  CircleFadingPlus,
  Clock,
  Info,
  UsersRound,
  X,
  Text,
} from "lucide-react";

import Image from "next/image";
import { Modal } from "../config/ModalMaps";
import { UnderlineInput } from "@/components/ui/underlineInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";
import { useUpdateMilestone } from "@/query/mutations/milestone";
import {
  UpdateMilestone,
  UpdateMilestoneFormProps,
  ValidationMilestoneErrors,
} from "@/types/milestone";

export function UpdateMilestoneForm({
  isOpen,
  onClose,
  project,
  initialData,
}: UpdateMilestoneFormProps) {
  //   const router = useRouter();
  const projectId = project.id;
  const projectMembers = project.projectUsers;

  const [formData, setFormData] = useState({
    title: initialData.title,
    content: initialData.content,
    category: initialData.category,
    start_date: initialData.start_date,
    end_date: initialData.end_date,
    goal: initialData.goal,
    note: initialData.note ?? "",
    participant_ids: initialData.participants.map((p) => p.member.id),
  });
  const [errors, setErrors] = useState<ValidationMilestoneErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState(
    initialData.participants.map((participant) => ({
      id: participant.member.id,
      name: participant.member.user.name,
      profileImage: participant.member.user.log.profileImage,
    }))
  );

  const updateMutation = useUpdateMilestone(projectId);

  const handleMemberSelect = (member: {
    id: number;
    name: string;
    profileImage: string;
  }) => {
    if (!selectedMembers.some((selected) => selected.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      setFormData((prev) => ({
        ...prev,
        participant_ids: [...prev.participant_ids, member.id],
      }));
    }
  };

  const handleRemoveMember = (memberId: number) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.id !== memberId)
    );
    setFormData((prev) => ({
      ...prev,
      participant_ids: prev.participant_ids.filter((id) => id !== memberId),
    }));
  };

  // textarea 높이 조절
  const adjustTextareaHeight = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // 높이 초기화
    textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞게 높이 조절
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (e.target instanceof HTMLTextAreaElement) {
      adjustTextareaHeight(e);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationMilestoneErrors = {
      title: !formData.title.trim() ? "제목을 입력해주세요." : undefined,
      content: !formData.content.trim() ? "내용을 입력해주세요." : undefined,
      category: !formData.category ? "카테고리를 선택해주세요." : undefined,
      start_date: !formData.start_date ? "시작일을 입력해주세요." : undefined,
      end_date: !formData.end_date ? "마감일을 입력해주세요." : undefined,
      goal: !formData.goal.trim() ? "내용을 입력해주세요." : undefined,
      participant_ids: !formData.participant_ids.length
        ? "참석자를 선택해주세요."
        : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async () => {
    setErrors({});
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      const milestoneData: UpdateMilestone = {
        ...formData,

        note: formData.note?.trim() === "" ? null : formData.note?.trim(),
      };

      updateMutation.mutate({
        milestoneId: initialData.id,
        data: milestoneData,
      });
      onClose();
      alert("마일스톤이 작성되었습니다.");
    } catch (error: any) {
      console.error("마일스톤 생성 실패", error);
    } finally {
      setIsLoading(false);
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
        <CustomAlertDialog
          onConfirm={onClose}
          title="작성을 취소할까요?"
          description="확인 버튼을 누르시면 작성 내용이 저장되지 않습니다."
        >
          <div className="flex justify-end items-center ">
            <X className="cursor-pointer" />
          </div>
        </CustomAlertDialog>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* 프론트/백엔드 선택 버튼 */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "FE" }))
              }
              className={`px-7 py-1 rounded-xl transition-colors ${
                formData.category === "FE"
                  ? "bg-custom-point text-white "
                  : "bg-white text-custom-smallText border border-gray-300 hover:bg-gray-300 hover:text-white"
              }`}
            >
              Frontend
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "BE" }))
              }
              className={`px-7 py-1 rounded-xl transition-colors ${
                formData.category === "BE"
                  ? "bg-custom-point text-white "
                  : "bg-white text-custom-smallText border border-gray-300 hover:bg-gray-300 hover:text-white"
              }`}
            >
              Backend
            </button>
          </div>

          {/* 제목 */}
          <div className="mt-4 mb-2">
            <UnderlineInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={50}
              placeholder="제목을 입력하세요."
              className="mx-2 p-0 border-b-0 font-semibold md:text-lg placeholder:text-[#BDBDBD]"
            />
            <hr className="border-0 border-b-2 border-custom-divider" />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.title}</p>
            )}
          </div>

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
                <Clock className="mr-3 w-5 h-5" /> 마감일
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

          {/* 참여자 */}
          <div>
            <div className="mx-2 flex flex-row items-center h-8 my-1">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <UsersRound className="mr-3 w-5 h-5" /> 참여 팀원 선택
              </label>

              <span className="w-auto text-red-500 mr-7">*</span>
              {/* 선택된 멤버 표시 */}
              <div className="flex flex-wrap gap-2 mx-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center rounded-full px-3 py-1 space-x-2 hover:bg-custom-main group"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Image
                      src={member.profileImage}
                      alt="Profile"
                      width={20}
                      height={20}
                      className="rounded-full object-cover max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px]"
                    />
                    <span>{member.name}</span>

                    <X className="h-4 w-4 cursor-pointer text-red-500 hidden group-hover:block" />
                  </div>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <CircleFadingPlus className="text-gray-600 cursor-pointer hover:text-custom-point" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                  {projectMembers.map((member) => {
                    return (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() =>
                          handleMemberSelect({
                            id: member.id,
                            name: member.user.name,
                            profileImage: member.user.log.profileImage,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <Image
                          src={member.user.log.profileImage}
                          alt="Profile"
                          width={20}
                          height={20}
                          className="rounded-full object-cover max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px]"
                        />

                        {member.user.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <hr className="border-custom-divider" />
            {errors.participant_ids && (
              <p className="text-red-500 text-sm mt-1 ml-2">
                {errors.participant_ids}
              </p>
            )}
          </div>

          {/* 목표 */}
          <div>
            <div className="flex flex-row items-center mx-2 mt-2">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <Text className="mr-3 w-5 h-5" /> 목표
              </label>
              <span className="w-auto text-red-500">*</span>
              <span className="flex flex-row items-center text-xs text-[#BDBDBD] ml-14">
                <Info className="w-3 h-3 mr-1 items-center" />
                현재 마일드스톤이 지향하는 목표를 입력해주세요.
              </span>
            </div>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder={`(예시) 프로젝트 핵심 기능 구현`}
              className="w-full min-h-[5rem] m-2 mt-3 text-sm resize-none placeholder:text-sm placeholder:text-[#BDBDBD] focus:outline-none"
              rows={1}
              required
            />
            <hr className="border-custom-divider" />
            {errors.goal && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.goal}</p>
            )}
          </div>

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
              placeholder="상세 내용을 입력하세요."
              className="w-full min-h-[5rem] m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] focus:outline-none"
              required
            />
            <hr className="border-custom-divider" />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.content}</p>
            )}
          </div>

          {/* 참고 사항 */}
          <div>
            <div className="flex flex-row items-center mx-2 mt-2">
              <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
                <Text className="mr-3 w-5 h-5" /> 참고 사항
              </label>

              <span className="flex flex-row items-center text-xs text-[#BDBDBD] ml-14">
                <Info className="w-3 h-3 mr-1 items-center" />
                현재 마일드스톤에 참고사항이나 예상되는 리스크가 있으면
                입력해주세요.
              </span>
            </div>
            <textarea
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              placeholder={`(예시) - API 응답 속도 최적화 필요`}
              className="w-full min-h-[3rem] m-2 mt-3 text-sm resize-none placeholder:text-sm placeholder:text-[#BDBDBD] focus:outline-none"
              rows={1}
            />
            <hr className="border-custom-divider" />
            {errors.note && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errors.note}</p>
            )}
          </div>
        </div>
        {/* 제출 버튼 */}
        <div className="flex space-x-2 justify-end mt-4 mb-4">
          <CustomAlertDialog
            onConfirm={onClose}
            title="작성을 취소할까요?"
            description="확인 버튼을 누르시면 작성 내용이 저장되지 않습니다."
          >
            <Modal.Button variant="secondary">닫기</Modal.Button>
          </CustomAlertDialog>

          <Modal.Button variant="primary" onClick={handleSubmit}>
            작성
          </Modal.Button>
        </div>
      </form>
    </Modal>
  );
}
