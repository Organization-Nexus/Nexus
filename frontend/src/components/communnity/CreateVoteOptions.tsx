import {
  CalendarDays,
  CheckCheck,
  EyeOff,
  ListChecks,
  Trash2,
  Vote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "../modal/config/ModalMaps";
import { CreateVoteDto } from "@/types/community";

const inputClass =
  "flex-1 p-2 border rounded-lg  outline-none placeholder:text-sm";
const buttonClass =
  "bg-green-200 hover:bg-green-300 text-gray-800 py-3 px-8 rounded-lg text-sm";

function OptionItem({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center text-sm gap-2 p-3 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${
        selected
          ? "bg-green-200 opacity-70 text-white"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function CreateVoteOptions({
  formData,
  setFormData,
}: {
  formData: CreateVoteDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateVoteDto>>;
}) {
  const [selected, setSelected] = useState({
    isMultipleChoice: formData?.isMultipleChoice || "false",
    isAnonymous: formData?.isAnonymous || "false",
  });

  const [options, setOptions] = useState<string[]>(formData?.options || []);
  const [newOption, setNewOption] = useState("");
  const [deadline, setDeadline] = useState<string | null>(
    formData?.deadline || null
  );

  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const updatedDeadline = isPastTime() ? null : deadline;
    setFormData((prev) => ({
      ...prev,
      isMultipleChoice: selected.isMultipleChoice,
      isAnonymous: selected.isAnonymous,
      options,
      deadline: updatedDeadline,
    }));
  }, [selected, options, deadline, setFormData]);

  const toggleOption = (option: "isMultipleChoice" | "isAnonymous") => {
    setSelected((prev) => ({
      ...prev,
      [option]: prev[option] === "true" ? "false" : "true",
    }));
  };

  const isPastTime = () => (deadline ? new Date(deadline) < new Date() : false);

  const addOption = () => {
    if (newOption && !options.includes(newOption)) {
      setOptions((prev) => [...prev, newOption]);
      setNewOption("");
    }
  };

  const removeOption = (index: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        <Vote size={20} />
        <span>
          투표항목 <span className="text-red-500">*</span>
        </span>
        <span className="text-xs text-gray-400 font-medium">
          2개 이상의 항목을 입력하세요. (필수)
        </span>
      </div>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 py-2 px-4 rounded-md"
          >
            <span className="text-gray-700">{option}</span>
            <Modal.Button variant="nothing" onClick={() => removeOption(index)}>
              <Trash2 size={14} className="text-red-400 hover:text-red-500" />
            </Modal.Button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="새 항목 입력..."
            className={inputClass}
          />
          <Modal.Button
            onClick={addOption}
            variant="nothing"
            className={`${buttonClass} ${
              !newOption ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            추가
          </Modal.Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <CalendarDays size={20} />
          <span>투표마감일</span>
          <span className="text-xs text-gray-400 font-medium">(선택)</span>
        </div>
        <div className="flex gap-2 text-sm w-1/2">
          <input
            type="datetime-local"
            value={deadline || ""}
            min={getTodayDate()}
            onChange={(e) => setDeadline(e.target.value)}
            className={`${inputClass} bg-gray-100`}
          />
        </div>
        {deadline && isPastTime() && (
          <p className="text-red-400 text-sm">
            마감일을 올바르게 설정해주세요.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        <CheckCheck size={20} />
        <span>투표옵션</span>
        <div className="flex justify-between flex-1 items-center text-xs text-gray-400 font-medium">
          <span>(선택)</span>
          <span> 기본값 : 단일투표, 공개투표</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <OptionItem
          icon={<ListChecks size={20} />}
          label="다중투표"
          selected={selected.isMultipleChoice === "true"}
          onClick={() => toggleOption("isMultipleChoice")}
        />
        <OptionItem
          icon={<EyeOff size={20} />}
          label="익명투표"
          selected={selected.isAnonymous === "true"}
          onClick={() => toggleOption("isAnonymous")}
        />
      </div>
    </div>
  );
}
