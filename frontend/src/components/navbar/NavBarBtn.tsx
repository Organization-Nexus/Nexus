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
      className={`flex items-center w-full ${padding} mt-1 rounded-md ${
        isActive
          ? "bg-blue-400 text-white"
          : "hover:bg-blue-400 hover:text-white"
      } transition-colors`}
    >
      {icon} {label}
    </button>
  );
}
