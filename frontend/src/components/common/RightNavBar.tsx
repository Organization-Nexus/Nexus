"use client";

import React from "react";

const RightNavBar: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex mb-4">
        <div className="flex gap-4 w-full">
          <div className="w-12 h-12 border-2 rounded-2xl">Image</div>
          <div className="w-full">
            <h1 className="text-lg font-semibold mb-1">Name</h1>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-sm text-gray-300">2024-12-15</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
      <div className="space-y-2">
        <h1>Content 1</h1>
        <h1>Content 2</h1>
        <h1>Content 3</h1>
        <h1>Content 4</h1>
      </div>
    </div>
  );
};

export default RightNavBar;
