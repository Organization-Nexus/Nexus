"use client";

import { formatDate } from "@/utils/dateFormatter";
import React from "react";

interface RightNavBarProps {
  contents: string[];
}

const RightNavBar = ({ contents }: RightNavBarProps) => {
  const currentDate = formatDate(new Date().toISOString()); // formatDate 함수 사용

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <div className="flex gap-4 w-full">
          <div className="w-12 h-12 border-2 rounded-2xl">Image</div>
          <div className="w-full">
            <h1 className="text-lg font-semibold mb-1">Name</h1>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-sm text-gray-300">{currentDate}</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
      <div className="space-y-2">
        {contents.map((content, index) => (
          <h1 key={index}>{content}</h1>
        ))}
      </div>
    </div>
  );
};

export default RightNavBar;
