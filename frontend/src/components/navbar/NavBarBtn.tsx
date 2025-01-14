import React from "react";

const NavBarBtn = ({
  onClick,
  icon,
  label,
  padding,
  isActive,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  padding?: string;
  isActive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full ${padding} mt-1 rounded-md ${
      isActive ? "bg-blue-400 text-white" : "hover:bg-blue-400 hover:text-white"
    } transition-colors`}
  >
    {icon} {label}
  </button>
);

export default NavBarBtn;
