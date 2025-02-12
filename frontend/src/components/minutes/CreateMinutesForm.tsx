"use client";

import { Button } from "../ui/button";
import { CustomAlertDialog } from "../common/CustomAlertDialog";

interface CreateMinutesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// const handleClose = () => {

//   // 모달 닫기
//   onClose();
// };

export function CreateMinutesForm({ isOpen, onClose }: CreateMinutesFormProps) {
  const initialValue = {
    title: "",
    date: "",
    time: "",
    participants: [],
    topic: "",
    content: "",
    decisions: "",
    notes: "",
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="제목을 입력하세요."
            className="text-xl font-semibold w-full border-none focus:outline-none"
          />
          <div className="flex items-center space-x-2">
            <input type="date" className="border rounded p-2" />
            <input type="time" className="border rounded p-2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">참여자</label>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
              <span>Pig</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
              <span>Cow</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
              <span>Sheep</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">주제</h3>
          <textarea
            className="w-full p-2 border rounded-lg min-h-[100px]"
            placeholder="회의 주제를 작성하세요."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">회의 내용</h3>
          <textarea
            className="w-full p-2 border rounded-lg min-h-[200px]"
            placeholder="내용을 입력하세요."
          />
        </div>

        {/* <div>
          <h3 className="font-medium mb-2">결정 사항</h3>
          <textarea
            className="w-full p-2 border rounded-lg min-h-[100px]"
            placeholder="회의를 통해 결정된 사항을 작성하세요."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">참고 사항</h3>
          <textarea
            className="w-full p-2 border rounded-lg min-h-[100px]"
            placeholder="참고 사항을 입력하세요."
          />
        </div> */}
      </div>

      <div className="flex justify-end">
        <CustomAlertDialog
          onConfirm={onClose}
          title="정말로 취소하시겠어요?"
          description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
        >
          <Button variant="outline" className="mr-1">
            취소
          </Button>
        </CustomAlertDialog>

        <Button variant="default">저장</Button>
      </div>
    </div>
  );
}
