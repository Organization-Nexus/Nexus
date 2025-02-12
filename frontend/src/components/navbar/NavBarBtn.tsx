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
        isActive ? "bg-[#c2d6ff] text-white" : "hover hover:text-[#c2d6ff]"
      } transition-colors`}
    >
      {icon} {label}
    </button>
  );
}
