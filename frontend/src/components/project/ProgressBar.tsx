import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  status: string;
}

const ProgressBar = ({ progress, status }: ProgressBarProps) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setProgressWidth(progress);
  }, [progress]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
      <div
        className="h-2.5 rounded-full bg-blue-600"
        style={{
          width: `${progressWidth}%`,
          transition: "width 1s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
