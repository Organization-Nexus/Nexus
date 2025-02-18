"use client";

import { CustomAlertDialog } from "../common/CustomAlertDialog";
import {
  CreateMinutes,
  CreateMinutesFormProps,
  ValidationMinutesErrors,
} from "@/types/minutes";
import { useState } from "react";
import { minutesApi } from "@/app/_api/models/minutes";
import { Modal } from "../modal/config/ModalMaps";
import {
  BadgeCheck,
  Calendar1,
  CircleFadingPlus,
  Clock,
  Info,
  UsersRound,
  X,
  Text,
} from "lucide-react";
import { UnderlineInput } from "../ui/underlineInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";

export function CreateMinutesForm({
  isOpen,
  onClose,
  project,
}: CreateMinutesFormProps) {
  // useQuery 추가 해야함!!!

  const projectId = project.id;
  const projectMembers = project.projectUsers;
  console.log("project.id: ", typeof project.id);
  console.log("projectMembers: ", projectMembers);
  const [formData, setFormData] = useState<CreateMinutes>({
    title: "",
    meeting_date: "",
    meeting_time: "",
    participant_ids: [],
    agenda: "",
    topic: "",
    content: "",
    decisions: null,
    notes: null,
  });
  const [errors, setErrors] = useState<ValidationMinutesErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<
    Array<{
      id: number;
      name: string;
      profileImage: string;
    }>
  >([]);
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
    const newErrors: ValidationMinutesErrors = {
      title: !formData.title.trim() ? "제목을 입력해주세요." : undefined,
      meeting_date: !formData.meeting_date ? "날짜을 입력해주세요." : undefined,
      meeting_time: !formData.meeting_time ? "시간을 입력해주세요." : undefined,
      participant_ids: !formData.participant_ids.length
        ? "참석자를 선택해주세요."
        : undefined,
      agenda: !formData.agenda.trim() ? "안건을 입력해주세요." : undefined,
      topic: !formData.topic.trim() ? "주제을 입력해주세요." : undefined,
      content: !formData.content.trim() ? "내용을 입력해주세요." : undefined,
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
      const minutesData: CreateMinutes = {
        ...formData,
        decisions:
          formData.decisions?.trim() === "" ? null : formData.decisions,
        notes: formData.notes?.trim() === "" ? null : formData.notes,
      };
      console.log("회의록 생성 데이터: ", minutesData);
      await minutesApi.createMinutesByProjectId(String(projectId), minutesData);
      console.log("회의록 생성 성공");
      onClose();
      alert("회의록이 작성되었씁니다.");
    } catch (error: any) {
      console.error("회의록 생성 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md py-8 px-12">
      <div className="flex justify-end items-center">
        <CustomAlertDialog
          onConfirm={onClose}
          title="창을 닫을까요?"
          description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
        >
          <X className="cursor-pointer" />
        </CustomAlertDialog>
      </div>

      <form onSubmit={handleSubmit} className="space-y-1">
        {/* 제목 */}
        <div>
          <UnderlineInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={50}
            placeholder="제목을 입력하세요.(필수)"
            className="mx-2 p-0 border-b-0 text-lg font-semibold md:text-lg placeholder:text-[#BDBDBD]"
          />
          <hr className="border-0 border-b-2 border-custom-divider" />
          {/* <hr className="border-custom-divider" /> */}
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        {/* 날짜, 시간 */}
        <div className="grid grid-cols-2 items-center mx-2">
          <div className="flex flex-row items-center">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Calendar1 className="mr-3 w-5 h-5" /> 날짜
            </label>
            <span className="w-auto text-red-500">*</span>
            <UnderlineInput
              type="date"
              name="meeting_date"
              value={formData.meeting_date}
              onChange={handleChange}
              required
              className="w-auto border-b-0 p-0 ml-14 text-base font-semibold md:text-base placeholder:text-[#BDBDBD]"
            />
          </div>
          <div className="flex flex-row items-center">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Clock className="mr-3 w-5 h-5" /> 시간
            </label>
            <span className="w-auto text-red-500">*</span>
            <UnderlineInput
              type="time"
              name="meeting_time"
              value={formData.meeting_time}
              onChange={handleChange}
              required
              className="w-auto border-b-0 p-0 ml-14 text-base font-semibold md:text-base placeholder:text-[#BDBDBD]"
            />
          </div>
        </div>
        <hr className="border-custom-divider" />
        <div className="grid grid-cols-2 items-center mr-2">
          {errors.meeting_date && (
            <p className="text-red-500 text-sm mt-1">{errors.meeting_date}</p>
          )}
          {errors.meeting_time && (
            <p className="text-red-500 text-sm mt-1">{errors.meeting_time}</p>
          )}
        </div>
        {/* 참석자 */}
        <div>
          <div className="mx-2 flex flex-row items-center h-8 mb-1">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <UsersRound className="mr-3 w-5 h-5" /> 참석자
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
            <p className="text-red-500 text-sm mt-1">
              {errors.participant_ids}
            </p>
          )}
        </div>
        {/* 안건 */}
        <div>
          <div className="flex flex-row items-center mx-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <BadgeCheck className="mr-3 w-5 h-5" /> 안건
            </label>
            <span className="w-auto text-red-500">*</span>
            <UnderlineInput
              type="text"
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              required
              placeholder="안건을 입력하세요."
              className="w-auto border-b-0 p-0 ml-14 text-base md:text-base placeholder:text-[#BDBDBD]"
            />
          </div>
          <hr className="border-custom-divider" />
          {errors.agenda && (
            <p className="text-red-500 text-sm mt-1">{errors.agenda}</p>
          )}
        </div>
        {/* 주제 */}
        <div>
          <div className="flex flex-row items-center mx-2 mt-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Text className="mr-3 w-5 h-5" /> 주제
            </label>
            <span className="w-auto text-red-500">*</span>
            <span className="flex flex-row items-center text-xs text-[#BDBDBD] ml-14">
              <Info className="w-3 h-3 mr-1 items-center" />
              회의 주제가 여러 개인 경우 구분하여 작성
            </span>
          </div>
          <textarea
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder={`(예시) 1. 진행상황 공유\n(예시) 2. 차주 계획 공유`}
            className="w-full h-12 m-2 mt-3 text-sm resize-none placeholder:text-sm placeholder:text-[#BDBDBD] focus:outline-none"
            required
          />
          <hr className="border-custom-divider" />
          {errors.topic && (
            <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
          )}
        </div>
        {/* 회의 내용 */}
        <div>
          <div className="flex flex-row items-center mx-2 mt-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Text className="mr-3 w-5 h-5" /> 회의 내용
            </label>
            <span className="w-auto text-red-500">*</span>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요."
            className="w-full h-20 m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] focus:outline-none"
            required
          />
          <hr className="border-custom-divider" />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* 결정 사항 */}
        <div>
          <div className="flex flex-row items-center mx-2 mt-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Text className="mr-3 w-5 h-5" /> 결정 사항
            </label>
          </div>
          <textarea
            name="decisions"
            value={formData.decisions?.trim()}
            onChange={handleChange}
            placeholder="회의를 통해 결정된 사항을 작성하세요."
            className="w-full h-8 m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] focus:outline-none"
          />
          <hr className="border-custom-divider" />
          {errors.decisions && (
            <p className="text-red-500 text-sm mt-1">{errors.decisions}</p>
          )}
        </div>

        {/* 참고 사항 */}
        <div>
          <div className="flex flex-row items-center mx-2 mt-2">
            <label className="w-auto flex flex-row items-center block text-base font-bold text-gray-600 pr-2">
              <Text className="mr-3 w-5 h-5" />
              참고 사항
            </label>
          </div>
          <textarea
            name="notes"
            value={formData.notes?.trim()}
            onChange={handleChange}
            placeholder="참고 사항을 입력하세요."
            className="w-full h-8 m-2 mt-3 text-sm resize-none placeholder:text-base placeholder:text-[#BDBDBD] focus:outline-none"
          />
          <hr className="border-custom-divider" />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex space-x-2 justify-end">
          <CustomAlertDialog
            onConfirm={onClose}
            title="창을 닫을까요?"
            description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
          >
            <Modal.Button variant="secondary">닫기</Modal.Button>
          </CustomAlertDialog>

          <Modal.Button variant="primary" onClick={handleSubmit}>
            생성
          </Modal.Button>
        </div>
      </form>
      {/* </Modal> */}
    </div>
  );
}
