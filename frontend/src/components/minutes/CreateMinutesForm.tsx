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
import { X } from "lucide-react";
import { UnderlineInput } from "../ui/underlineInput";

// const handleClose = () => {

//   // 모달 닫기
//   onClose();
// };

export function CreateMinutesForm({
  isOpen,
  onClose,
  projectId,
}: CreateMinutesFormProps) {
  // useQuery 추가 해야함!!!

  const [formData, setFormData] = useState<CreateMinutes>({
    title: "",
    date: "",
    time: "",
    participants: [],
    topic: "",
    content: "",
    decisions: "",
    notes: "",
  });
  const [errors, setErrors] = useState<ValidationMinutesErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // // 실시간 유효성 검사
    // const validationError =
    //   validateMinutes[name as keyof typeof validateMinutes]?.(value);
    // setErrors((prev) => ({
    //   ...prev,
    //   [name]: validationError,
    // }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationMinutesErrors = {
      title: !formData.title.trim() ? "제목을 입력해주세요." : undefined,
      date: !formData.date ? "날짜을 입력해주세요." : undefined,
      time: !formData.time ? "시간을 입력해주세요." : undefined,
      participants: !formData.participants.length
        ? "참여자을 선택해주세요."
        : undefined,
      topic: !formData.topic.trim() ? "주제을 입력해주세요." : undefined,
      content: !formData.content.trim() ? "내용을 입력해주세요." : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async () => {
    // e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const minutesData: CreateMinutes = formData;

      await minutesApi.createMinutesByProjectId(projectId, minutesData);
      console.log("회의록 생성 성공");
    } catch (error: any) {
      const serverErrorMessage =
        //   error.response?.data?.message || "회의록 생성에 실패했습니다.";
        // setServerError(serverErrorMessage);
        console.error("회의록 생성 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="bg-white rounded-xl shadow-md p-6">
    //   <div className="space-y-4">
    //     <div className="flex justify-between items-center">
    //       <input
    //         type="text"
    //         placeholder="제목을 입력하세요."
    //         className="text-xl font-semibold w-full border-none focus:outline-none"
    //       />
    //       <div className="flex items-center space-x-2">
    //         <input type="date" className="border rounded p-2" />
    //         <input type="time" className="border rounded p-2" />
    //       </div>
    //     </div>

    //     <div className="space-y-2">
    //       <label className="text-sm font-medium">참여자</label>
    //       <div className="flex space-x-2">
    //         <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
    //           <span>Pig</span>
    //         </div>
    //         <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
    //           <span>Cow</span>
    //         </div>
    //         <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
    //           <span>Sheep</span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="space-y-4">
    //     <div>
    //       <h3 className="font-medium mb-2">주제</h3>
    //       <textarea
    //         className="w-full p-2 border rounded-lg min-h-[100px]"
    //         placeholder="회의 주제를 작성하세요."
    //       />
    //     </div>

    //     <div>
    //       <h3 className="font-medium mb-2">회의 내용</h3>
    //       <textarea
    //         className="w-full p-2 border rounded-lg min-h-[200px]"
    //         placeholder="내용을 입력하세요."
    //       />
    //     </div>

    //     {/* <div>
    //       <h3 className="font-medium mb-2">결정 사항</h3>
    //       <textarea
    //         className="w-full p-2 border rounded-lg min-h-[100px]"
    //         placeholder="회의를 통해 결정된 사항을 작성하세요."
    //       />
    //     </div>

    //     <div>
    //       <h3 className="font-medium mb-2">참고 사항</h3>
    //       <textarea
    //         className="w-full p-2 border rounded-lg min-h-[100px]"
    //         placeholder="참고 사항을 입력하세요."
    //       />
    //     </div> */}
    //   </div>

    //   <div className="flex justify-end">
    //     <CustomAlertDialog
    //       onConfirm={onClose}
    //       title="정말로 취소하시겠어요?"
    //       description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
    //     >
    //       <Button variant="outline" className="mr-1">
    //         취소
    //       </Button>
    //     </CustomAlertDialog>

    //     <Button variant="default">저장</Button>
    //   </div>
    // </div>
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick={false}> */}
      <div className="flex justify-between items-center">
        <CustomAlertDialog
          onConfirm={onClose}
          title="창을 닫을까요?"
          description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
        >
          <X className="cursor-pointer mr-4" />
        </CustomAlertDialog>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div>
          <UnderlineInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={50}
            placeholder="제목을 입력하세요.(필수)"
            className="p-0"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        {/* 날짜, 시간 */}
        <div className="flex justify-between w-full">
          <div className="w-1/2 pr-2">
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                날짜 <span className="text-red-500">*</span>
              </label>
            </div>
            <UnderlineInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* 시간 */}
          <div className="w-1/2 pl-2">
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                시간 <span className="text-red-500">*</span>
              </label>
            </div>
            <UnderlineInput
              type="time"
              name="end_date"
              value={formData.time}
              onChange={handleChange}
              required
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
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
      </form>
      {/* </Modal> */}
    </div>
  );
}
