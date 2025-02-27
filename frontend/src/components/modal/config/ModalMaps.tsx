"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import {
  BaseModalProps,
  ButtonProps,
  CheckBoxProps,
  CheckButtonProps,
  InputProps,
  LabelButtonProps,
  ModalRootProps,
  TextButtonProps,
} from "@/types/modal";
import React from "react";

// Dimmed 배경
function ModalDimmed({ className }: { className?: string }) {
  const baseClassName = "fixed inset-0 bg-black bg-opacity-65";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return <div className={finalClassName} />;
}

// 메인 모달
function ModalRoot({
  isOpen,
  onClose,
  children,
  className,
  hasOverlay = true,
  closeOnOutsideClick = true, // false일때 밖을 클릭해도 닫히지 않음
}: ModalRootProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!closeOnOutsideClick) return;
    const overlay = e.currentTarget;
    const clickedElement = e.target as HTMLElement;

    if (overlay === clickedElement) {
      onClose();
    }
  };
  if (!isOpen) return null;

  const baseClassName = "fixed inset-0 z-50";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        hasOverlay ? "bg-black bg-opacity-65" : ""
      }`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white p-6 rounded-2xl shadow-lg w-1/2 z-10 ${
          className || ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// 제목
function ModalTitle({ children, className }: BaseModalProps) {
  const baseClassName = "text-2xl font-bold mb-4";
  const finalClassName = className ? `${className}` : baseClassName;
  return <div className={finalClassName}>{children}</div>;
}

// 부제목
function ModalSubtitle({ children, className }: BaseModalProps) {
  const baseClassName = "text-sm font-semibold mb-2 text-gray-700";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return <h3 className={finalClassName}>{children}</h3>;
}

// 설명
function ModalDescription({ children, className }: BaseModalProps) {
  const baseClassName = "text-sm text-gray-600 mb-4";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return <p className={finalClassName}>{children}</p>;
}

// 코멘트
function ModalComment({ children, className }: BaseModalProps) {
  const baseClassName = "text-xs text-gray-500 italic";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return <div className={finalClassName}>{children}</div>;
}

// 체크버튼
function ModalCheckButton({
  checked,
  onChange,
  label,
  className,
}: CheckButtonProps) {
  const baseClassName = "flex items-center space-x-2";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return (
    <button
      className={finalClassName}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <div
        className={`w-4 h-4 border rounded ${
          checked ? "bg-blue-500" : "bg-white"
        }`}
      />
      <span>{label}</span>
    </button>
  );
}

// 체크박스
function ModalCheckBox({ checked, onChange, label, className }: CheckBoxProps) {
  const baseClassName = "flex items-center space-x-2 cursor-pointer";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return (
    <label className={finalClassName}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span>{label}</span>
    </label>
  );
}

// 텍스트 버튼
function ModalTextButton({
  onClick,
  children,
  disabled,
  className,
}: TextButtonProps) {
  const baseClassName =
    "text-blue-500 hover:text-blue-700 disabled:text-gray-400";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      type="button"
    >
      {children}
    </button>
  );
}

// 기본 버튼
const ModalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      children,
      variant = "primary",
      disabled,
      className,
      type = "button",
    }: ButtonProps,
    ref
  ) => {
    const variantClasses = {
      primary: "bg-[#50E161] hover:bg-[#45c14f] text-white",
      secondary:
        "bg-white text-black border border-gray-300 hover:bg-gray-300 hover:text-white",
      danger: "bg-red-500 hover:bg-red-700 text-white",
      nothing: "",
    };

    const baseClassName = "px-4 py-2 rounded-md";
    const finalClassName = className
      ? `${baseClassName} ${variantClasses[variant]} disabled:opacity-50 ${className}`
      : `${baseClassName} ${variantClasses[variant]} disabled:opacity-50`;

    return (
      <div className="flex justify-center">
        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={finalClassName}
          type={type}
        >
          {children}
        </button>
      </div>
    );
  }
);
export default ModalButton;

// 라벨 버튼
function ModalLabelButton({
  label,
  children,
  className,
  ...props
}: LabelButtonProps) {
  const baseClassName = "flex flex-col items-center";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return (
    <div className={finalClassName}>
      <span className="text-sm text-gray-600 mt-1">{label}</span>
    </div>
  );
}

// 구분선
function ModalDivider({ className }: BaseModalProps) {
  const baseClassName = "my-4 border-gray-200";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;
  return <hr className={finalClassName} />;
}

// 입력
function ModalInput({ type, className, ...props }: InputProps) {
  const baseClassName = "mt-1 p-2 border border-gray-300 rounded-md w-full";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  if (type === "textarea") {
    return <textarea {...props} className={finalClassName} />;
  }

  return (
    <input
      type={type}
      maxLength={props.maxLength}
      {...props}
      className={finalClassName}
    />
  );
}

// 모달 컴포넌트 조합
export const Modal = Object.assign(ModalRoot, {
  Dimmed: ModalDimmed,
  Title: ModalTitle,
  Subtitle: ModalSubtitle,
  Description: ModalDescription,
  Comment: ModalComment,
  CheckButton: ModalCheckButton,
  CheckBox: ModalCheckBox,
  TextButton: ModalTextButton,
  Button: ModalButton,
  LabelButton: ModalLabelButton,
  Divider: ModalDivider,
  Input: ModalInput,
});
