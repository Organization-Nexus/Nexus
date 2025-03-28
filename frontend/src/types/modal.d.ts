import { ReactNode, ChangeEvent } from "react";

// 기본 props 인터페이스
export interface BaseModalProps {
  className?: string;
  children?: ReactNode;
}

// 기본 모달 인터페이스
export interface ModalRootProps extends BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasOverlay?: boolean;
  closeOnOutsideClick?: boolean;
}

// 유형별 모달 인터페이스
export interface CommunityModalProps extends ModalRootProps {
  type: string;
  mode?: "create" | "update";
  projectId: string;
  feedId?: string;
  updateData?: {
    title: string;
    content: string;
    community_files?: string[];
    isImportant?: string;
  };
}

export interface CreateCommunity extends ModalRootProps {
  type: string;
  projectId: string;
}

export interface UpdateCommunity extends ModalRootProps {
  type: string;
  projectId: string;
  feedId: string;
  updateData: {
    title: string;
    content: string;
    community_files?: string[];
    isImportant?: string | boolean;
  };
}

// 체크버튼 컴포넌트
export interface CheckButtonProps extends BaseModalProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

// 체크박스 컴포넌트
export interface CheckBoxProps extends BaseModalProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

// 텍스트 버튼 컴포넌트
export interface TextButtonProps extends BaseModalProps {
  onClick: () => void;
  disabled?: boolean;
}

// 기본 버튼 컴포넌트
export interface ButtonProps extends TextButtonProps {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "nothing";
  type?: "button" | "submit" | "reset";
}

// 라벨 버튼 컴포넌트
export interface LabelButtonProps extends ButtonProps {
  label: string;
}

// 입력 컴포넌트
export interface InputProps {
  type: "text" | "date" | "textarea" | "number" | "email";
  name: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  maxLength?: number;
  className?: string;
}

export interface MyPageProps {
  user: {
    name: string;
    log: {
      profileImage: string;
    };
  };
}
