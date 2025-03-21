import { NavBarBtnProps } from "@/types/navbar";

export default function NavBarBtn({
  onClick,
  padding,
  isActive,
  icon,
  label,
}: NavBarBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full ${padding} rounded-md ${
        isActive ? "bg-[#75ea8d] text-white" : "hover hover:text-[#75ea8d]"
      } transition-colors`}
    >
      {icon} {label}
    </button>
  );
}
