import { createPortal } from "react-dom";
import { ReactNode, ChangeEvent } from "react";

interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// 기본 모달 인터페이스
interface ModalRootProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dimmed 배경
function ModalDimmed({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClick} />
  );
}

// 제목 컴포넌트
function ModalTitle({ children, className }: BaseProps) {
  return <h2 className={`text-xl font-bold mb-2 ${className}`}>{children}</h2>;
}

// 부제목 컴포넌트
function ModalSubtitle({ children, className }: BaseProps) {
  return (
    <h3 className={`text-lg font-semibold mb-2 text-gray-700 ${className}`}>
      {children}
    </h3>
  );
}

// 설명 컴포넌트
function ModalDescription({ children, className }: BaseProps) {
  return (
    <p className={`text-sm text-gray-600 mb-4 ${className}`}>{children}</p>
  );
}

// 코멘트 컴포넌트
function ModalComment({ children, className }: BaseProps) {
  return (
    <div className={`text-xs text-gray-500 italic ${className}`}>
      {children}
    </div>
  );
}

// 체크버튼 컴포넌트
interface CheckButtonProps extends BaseProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ModalCheckButton({
  checked,
  onChange,
  label,
  className,
}: CheckButtonProps) {
  return (
    <button
      className={`flex items-center space-x-2 ${className}`}
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

// 체크박스 컴포넌트
interface CheckBoxProps extends BaseProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ModalCheckBox({ checked, onChange, label, className }: CheckBoxProps) {
  return (
    <label
      className={`flex items-center space-x-2 cursor-pointer ${className}`}
    >
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

// 텍스트 버튼 컴포넌트
interface TextButtonProps extends BaseProps {
  onClick: () => void;
  disabled?: boolean;
}

function ModalTextButton({
  onClick,
  children,
  disabled,
  className,
}: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-blue-500 hover:text-blue-700 disabled:text-gray-400 ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

// 기본 버튼 컴포넌트
interface ButtonProps extends TextButtonProps {
  variant?: "primary" | "secondary" | "danger";
}

function ModalButton({
  onClick,
  children,
  variant = "primary",
  disabled,
  className,
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md ${variantClasses[variant]} disabled:opacity-50 ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

// 라벨 버튼 컴포넌트
interface LabelButtonProps extends ButtonProps {
  label: string;
}

function ModalLabelButton({ label, children, ...props }: LabelButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <ModalButton {...props}>{children}</ModalButton>
      <span className="text-sm text-gray-600 mt-1">{label}</span>
    </div>
  );
}

// 구분선 컴포넌트
function ModalDivider({ className }: BaseProps) {
  return <hr className={`my-4 border-gray-200 ${className}`} />;
}

// 입력 컴포넌트
interface InputProps {
  type: "text" | "date" | "textarea" | "number" | "email";
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  className?: string;
}

function ModalInput({ type, ...props }: InputProps) {
  const baseClassName = "mt-1 p-2 border border-gray-300 rounded-md w-full";
  const finalClassName = props.className
    ? `${baseClassName} ${props.className}`
    : baseClassName;

  if (type === "textarea") {
    return <textarea {...props} className={finalClassName} />;
  }

  return <input type={type} {...props} className={finalClassName} />;
}

// 메인 모달 컴포넌트
function ModalRoot({ isOpen, onClose, children, className }: ModalRootProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <ModalDimmed onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
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
