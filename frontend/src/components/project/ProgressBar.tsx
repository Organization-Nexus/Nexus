"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  status?: string;
}

const ProgressBar = ({ progress, status }: ProgressBarProps) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setProgressWidth(progress);
  }, [progress]);

  let progressColor = "";
  if (status === "in-progress") {
    progressColor = "bg-blue-400";
  } else if (status === "scheduled") {
    progressColor = "bg-transparent";
  } else if (status === "completed") {
    progressColor = "bg-gray-400";
  } else {
    progressColor = "bg-green-200";
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
      <div
        className={`h-2 rounded-full ${progressColor}`}
        style={{
          width: `${progressWidth}%`,
          transition: "width 1.5s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
