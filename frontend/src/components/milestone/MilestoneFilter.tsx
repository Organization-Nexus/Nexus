import { House, Monitor, SquareTerminal } from "lucide-react";

interface MilestoneFilterProps {
  currentFilter: "All" | "FE" | "BE";
  onFilterChange: (filter: "All" | "FE" | "BE") => void;
}

export default function MilestoneFilter({
  currentFilter,
  onFilterChange,
}: MilestoneFilterProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        className={`flex items-center space-x-1 py-1 text-custom-smallText hover:text-primary transition-colors ${
          currentFilter === "All"
            ? "text-primary font-semibold border-b-2 border-primary"
            : ""
        }`}
        onClick={() => onFilterChange("All")}
      >
        <House size={20} />
        <span>전체보기</span>
      </button>
      {[
        { value: "FE", label: "프론트엔드", icon: <Monitor size={20} /> },
        { value: "BE", label: "백엔드", icon: <SquareTerminal size={20} /> },
      ].map(({ value, label, icon }) => (
        <button
          key={value}
          className={`flex items-center space-x-1 py-1 text-custom-smallText hover:text-primary transition-colors ${
            currentFilter === value
              ? "text-primary font-semibold border-b-2 border-primary"
              : ""
          }`}
          onClick={() => onFilterChange(value as "FE" | "BE")}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
