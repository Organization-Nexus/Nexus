"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { userValidation } from "@/utils/validators/userValidation";

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
        className={`p-3 rounded-lg text-sm ${
          message.type === "error"
            ? "bg-red-50 text-red-500"
            : "bg-green-50 text-green-500"
        }`}
      >
        {message.text}
      </div>
    );
  };

  // 이전 단계로 이동
  const handlePrevStep = () => {
    setStep((prev) => (prev - 1) as Step);
    setMessage({ type: "", text: "" });
  };

  const validate = (field: keyof FormDataType) => {
    let errorMessage: string | undefined;

    if (field === "email") {
      errorMessage = userValidation.email(formData.email);
    } else if (field === "code") {
      errorMessage = !formData.code ? "인증번호를 입력해주세요." : undefined;
    } else if (field === "newPassword" || field === "confirmPassword") {
      errorMessage = userValidation.password(
        formData.newPassword && formData.confirmPassword
      );
      if (!errorMessage && formData.newPassword !== formData.confirmPassword) {
        errorMessage = "비밀번호가 일치하지 않습니다.";
      }
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
        text: "인증 코드가 이메일로 전송되었습니다. 이메일을 확인해주세요.",
      });
      setResendTimeout(180); // 3분
      setStep(2);
    } catch (error) {
      setMessage({
        type: "error",
        text: "이메일 전송에 실패했습니다. 다시 시도해주세요.",
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
        text: "인증 코드가 재전송되었습니다. 이메일을 확인해주세요.",
      });
      setResendTimeout(180); // 3분
    } catch (error) {
      setMessage({
        type: "error",
        text: "이메일 재전송에 실패했습니다.",
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
      setMessage({ type: "success", text: "인증번호가 확인되었습니다." });
      setStep(3);
    } catch (error) {
      setMessage({ type: "error", text: "잘못된 인증번호입니다." });
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
      alert(
        "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다."
      );
      router.push("/login");
    } catch (error) {
      setMessage({
        type: "error",
        text: "비밀번호 변경에 실패했습니다.",
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
              {resendTimeout > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-custom-point">
                  {formatTime(resendTimeout)}
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
