"use client";

import { Minutes } from "@/types/minutes";
import { Button } from "../ui/button";

interface MinutesDetailProps {
  isCreating: boolean;
  selectedMinutes: Minutes | null;
}
export function MinutesDetail({
  isCreating,
  selectedMinutes,
}: MinutesDetailProps) {
  const initialValue = selectedMinutes || {
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
    <div className="space-y-6">
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

        <div>
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
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="default">저장</Button>
      </div>
    </div>
  );
}
