import { authApi } from "@/app/_api/models/auth";
import {
  handleApiError,
  userValidation,
} from "@/utils/validators/userValidation";
import { useEffect, useState } from "react";
import { UnderlineInput } from "../ui/underlineInput";
import { Modal } from "../modal/config/ModalMaps";

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PasswordChangeForm = ({ onClose }: { onClose: () => void }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // 실시간 유효성 검사
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "currentPassword":
        return userValidation.password(value);
      case "newPassword":
        const newPasswordError = userValidation.newPassword(value);
        // 비밀번호가 변경되면 확인도 다시 체크
        if (passwordForm.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: userValidation.confirmPassword(
              value,
              passwordForm.confirmPassword
            ),
          }));
        }
        return newPasswordError;
      case "confirmPassword":
        return userValidation.confirmPassword(passwordForm.newPassword, value);
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사 실행
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: PasswordErrors = {
      currentPassword: validateField(
        "currentPassword",
        passwordForm.currentPassword
      ),
      newPassword: validateField("newPassword", passwordForm.newPassword),
      confirmPassword: validateField(
        "confirmPassword",
        passwordForm.confirmPassword
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await authApi.changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // 성공시
      alert("비밀번호가 성공적으로 변경되었습니다.");
      onClose();
    } catch (error) {
      setServerError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {serverError && (
        <div
          className="bg-red-50 text-red-500 p-3 rounded-lg text-sm 
                    transition-all duration-500 ease-in-out 
                    opacity-100 animate-in fade-in"
        >
          {serverError}
        </div>
      )}

      <form className="space-y-4">
        <p className="text-xs text-gray-500 mt-3">
          8~20자 영문, 숫자, 특수문자 조합
        </p>
        <div className="grid grid-cols-6">
          <div className="self-center">
            <label className="text-sm font-bold text-gray-700">
              현재 비밀번호
            </label>
          </div>
          <div className="col-span-5">
            <UnderlineInput
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력해주세요"
              className="p-0"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6">
          <div className="self-center">
            <label className="text-sm font-bold text-gray-700">
              새 비밀번호
            </label>
          </div>
          <div className="col-span-5">
            <UnderlineInput
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 입력해주세요"
              className="p-0"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6">
          <div className="self-center">
            <label className="text-sm font-bold text-gray-700">
              비밀번호 확인
            </label>
          </div>
          <div className="col-span-5">
            <UnderlineInput
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              className="p-0"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Modal.Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="text-sm"
          >
            취소
          </Modal.Button>
          <Modal.Button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="text-sm"
          >
            {isLoading ? "변경 중..." : "확인"}
          </Modal.Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
