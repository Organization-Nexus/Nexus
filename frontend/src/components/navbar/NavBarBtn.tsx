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
        isActive ? "bg-green-300 text-white" : "hover hover:text-green-300"
      } transition-colors`}
    >
      {icon} {label}
    </button>
  );
}
