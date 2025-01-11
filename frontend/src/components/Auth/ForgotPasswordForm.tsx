"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import {
  userValidation,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_CONSTANTS,
} from "@/utils/validators/userValidation";

type Step = 1 | 2 | 3;

type MessageType = {
  type: "error" | "success" | "";
  text: string;
};

type FormDataType = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<MessageType>({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [codeTimeout, setCodeTimeout] = useState(0);

  const router = useRouter();

  // 재전송 타이머 관리
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimeout > 0) {
      timer = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimeout]);

  // 인증코드 유효 시간 타이머 관리
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (codeTimeout > 0) {
      timer = setInterval(() => {
        setCodeTimeout((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [codeTimeout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 메시지 표시 컴포넌트
  const MessageBox = () => {
    if (!message.text) return null;
    return (
      <div
        className={`p-3 rounded-lg text-sm whitespace-pre-line ${
          message.type === "error"
            ? "bg-red-50 text-red-500"
            : "bg-green-50 text-green-500"
        }`}
      >
        {message.text}
      </div>
    );
  };

  const validate = (field: keyof FormDataType): boolean => {
    let errorMessage: string | undefined;

    switch (field) {
      case "email":
        errorMessage = userValidation.email(formData.email);
        break;
      case "code":
        errorMessage = userValidation.verificationCode(formData.code);
        break;
      case "newPassword":
      case "confirmPassword":
        errorMessage = userValidation.newPassword(formData.newPassword);
        if (!errorMessage) {
          errorMessage = userValidation.confirmPassword(
            formData.newPassword,
            formData.confirmPassword
          );
        }
        break;
    }

    if (errorMessage) {
      setMessage({ type: "error", text: errorMessage });
      return false;
    }
    return true;
  };

  // 이메일로 코드 전송
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate("email")) return;

    setIsLoading(true);
    try {
      await authApi.sendResetCode({ email: formData.email });
      setMessage({
        type: "success",
        text: SUCCESS_MESSAGES.CODE_SENT,
      });
      setResendTimeout(VALIDATION_CONSTANTS.RESEND_TIMEOUT); // 재전송 제한 1분
      setCodeTimeout(VALIDATION_CONSTANTS.CODE_TIMEOUT); // 인증코드 유효시간 3분
      setStep(2);
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"]; // 남은 시간(초)
        const remainingTries = error.response.headers["x-ratelimit-remaining"]; // 남은 시도 횟수

        setMessage({
          type: "error",
          text: ERROR_MESSAGES.EMAIL_SEND_LIMIT_ERROR,
        });
      } else
        setMessage({
          type: "error",
          text: ERROR_MESSAGES.EMAIL_SEND_ERROR,
        });
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 재전송
  const handleResendCode = async () => {
    if (resendTimeout > 0) return;

    setIsLoading(true);
    try {
      formData.code = "";
      await authApi.sendResetCode({ email: formData.email });
      setMessage({
        type: "success",
        text: SUCCESS_MESSAGES.CODE_RESENT,
      });
      setCodeTimeout(VALIDATION_CONSTANTS.CODE_TIMEOUT); // 3분
      setResendTimeout(VALIDATION_CONSTANTS.RESEND_TIMEOUT); // 1분
    } catch (error) {
      setMessage({
        type: "error",
        text: ERROR_MESSAGES.EMAIL_SEND_ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 코드 확인
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate("code")) return;

    setIsLoading(true);
    try {
      await authApi.verifyResetCode({
        email: formData.email,
        code: formData.code,
      });
      setMessage({ type: "success", text: SUCCESS_MESSAGES.CODE_VERIFIED });
      setStep(3);
    } catch (error) {
      setMessage({ type: "error", text: ERROR_MESSAGES.CODE_INVALID });
    } finally {
      setIsLoading(false);
    }
  };

  // 새 비밀번호 설정
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate("newPassword")) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      });
      alert(SUCCESS_MESSAGES.PASSWORD_RESET);
      router.push("/login");
    } catch (error) {
      setMessage({
        type: "error",
        text: ERROR_MESSAGES.PASSWORD_RESET_ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 남은 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <MessageBox />

      {step === 1 && (
        <form onSubmit={handleSendCode}>
          <div className="space-y-4">
            <Input
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="text-lg p-6"
              name="email"
            />

            <Button
              type="submit"
              className="w-full bg-custom-point hover:bg-custom-hover"
              disabled={isLoading}
            >
              {isLoading ? "전송 중..." : "인증번호 받기"}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={formData.code}
                onChange={handleChange}
                placeholder="인증번호 6자리"
                name="code"
                className="text-lg p-6"
              />
              {codeTimeout > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-custom-point">
                  {formatTime(codeTimeout)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleResendCode}
                disabled={resendTimeout > 0 || isLoading}
              >
                {resendTimeout > 0
                  ? `${formatTime(resendTimeout)} 후 재전송 가능`
                  : "인증번호 재전송"}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-custom-point hover:bg-custom-hover"
                disabled={isLoading}
              >
                {isLoading ? "확인 중..." : "확인"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <Input
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호 (8자 이상)"
              name="newPassword"
              className="text-lg p-6"
            />
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호 확인"
              name="confirmPassword"
              className="text-lg p-6"
            />
            <Button
              type="submit"
              className="w-full bg-custom-point hover:bg-custom-hover"
              disabled={isLoading}
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </div>
        </form>
      )}
      <div className="text-sm text-right">
        <a href="/login" className="text-gray-500 hover:text-gray-700 pr-2">
          로그인
        </a>
        <a href="/register" className="text-gray-500 hover:text-gray-700">
          회원가입
        </a>
      </div>
    </div>
  );
}
