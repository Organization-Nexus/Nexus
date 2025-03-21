"use client";

import { useEffect, useState } from "react";

type Position = string;

interface PositionSelectProps {
  onSelectPosition: (position: string) => void; // 단일 문자열로 변경
  currentPosition?: string;
  className?: string;
}

export function PositionSelect({
  onSelectPosition,
  currentPosition,
  className = "",
}: PositionSelectProps) {
  const POSITION_MAP = {
    Frontend: "FE",
    Backend: "BE",
    Design: "DESIGN",
    PM: "PM",
    ETC: "ETC",
  };

  // DB값을 화면표시용 값으로 변환하는 역매핑
  const REVERSE_POSITION_MAP: Record<string, string> = {
    FE: "Frontend",
    BE: "Backend",
    DESIGN: "Design",
    PM: "PM",
    ETC: "ETC",
  };

  const [selectedPosition, setSelectedPosition] = useState<string>(
    currentPosition ? REVERSE_POSITION_MAP[currentPosition] : ""
  );

  useEffect(() => {
    if (currentPosition) {
      setSelectedPosition(REVERSE_POSITION_MAP[currentPosition]);
    }
  }, [currentPosition]);

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    onSelectPosition(POSITION_MAP[position as keyof typeof POSITION_MAP]);
  };

  return (
    <div className={`flex flex-wrap gap-2 px-3 mb-5 ${className}`}>
      {Object.keys(POSITION_MAP).map((position) => (
        <button
          key={position}
          type="button"
          onClick={() => handlePositionSelect(position)}
          className={`text-sm px-4 py-2 rounded-full border transition-colors
            ${
              selectedPosition === position
                ? "border-custom-point bg-custom-point text-white"
                : "border-gray-300 hover:border-[#50E161]"
            }`}
        >
          {position}
        </button>
      ))}
    </div>
  );
}
