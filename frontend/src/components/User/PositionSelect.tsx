"use client";

import { useState } from "react";

type Position = string;

interface PositionSelectProps {
  onSelectPosition: (position: string) => void; // 단일 문자열로 변경
}

export function PositionSelect({ onSelectPosition }: PositionSelectProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position>("");

  const POSITION_MAP = {
    Frontend: "FE",
    Backend: "BE",
    Design: "DESIGN",
    PM: "PM",
    ETC: "ETC",
  };

  // 포지션 선택 함수
  const selectPosition = (displayPosition: string) => {
    setSelectedPosition(displayPosition);
    const dbPosition =
      POSITION_MAP[displayPosition as keyof typeof POSITION_MAP];
    onSelectPosition(dbPosition);
  };

  return (
    <div className="flex flex-wrap gap-2 px-3 mb-5">
      {Object.keys(POSITION_MAP).map((position) => (
        <button
          key={position}
          type="button"
          onClick={() => selectPosition(position)}
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
