"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterRequest } from "@/types/auth";
import { userValidation } from "@/utils/validators/userValidation";
import { ValidationErrors } from "@/types/user";
import { authApi } from "@/app/_api/models/auth";
import { UnderlineInput } from "../ui/underlineInput";
import { PositionSelect } from "../user/PositionSelect";
import { Button } from "../ui/button";

export default function RegisterFormComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    Omit<RegisterRequest, "mainPosition">
  >({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    githubUrl: "",
  });
  const [selectedPositions, setSelectedPositions] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerValidation = {
    name: userValidation.name,
    email: userValidation.email,
    password: userValidation.password,
    phoneNumber: userValidation.phoneNumber,
    githubUrl: userValidation.githubUrl,
  } as const;

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    const validationError =
      registerValidation[name as keyof typeof registerValidation]?.(value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const handlePositionSelect = (position: string) => {
    setSelectedPositions(position);
    setErrors((prev) => ({ ...prev, mainPosition: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: userValidation.name(formData.name),
      email: userValidation.email(formData.email),
      password: userValidation.password(formData.password),
      phoneNumber: userValidation.phoneNumber(formData.phoneNumber),
      githubUrl: userValidation.githubUrl(formData.githubUrl),
      mainPosition: !selectedPositions ? "포지션을 선택해주세요." : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData: RegisterRequest = {
        ...formData,
        mainPosition: selectedPositions,
      };

      await authApi.register(signupData);
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error: any) {
      const serverErrorMessage =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      setServerError(serverErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {serverError && (
        <div
          className="bg-red-50 text-red-500 p-3  rounded-lg text-sm 
                  transition-all duration-500 ease-in-out 
                  opacity-100 animate-in fade-in "
        >
          {serverError}
        </div>
      )}
      <div>
        <UnderlineInput
          placeholder="이름"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <UnderlineInput
          placeholder="이메일"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <UnderlineInput
          placeholder="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <UnderlineInput
          placeholder="전화번호 (숫자만 입력)"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <div>
        <UnderlineInput
          placeholder="github 주소 (선택)"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
        />
        {errors.githubUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.githubUrl}</p>
        )}
      </div>

      <div>
        <p className="mb-3 px-3 text-muted-foreground text-base md:text-sm">
          주포지션 선택
        </p>
        <PositionSelect onSelectPosition={handlePositionSelect} />
        {errors.mainPosition && (
          <p className="text-red-500 text-sm mt-1">{errors.mainPosition}</p>
        )}
      </div>

      <Button
        className="w-full bg-custom-point hover:bg-custom-hover text-white text-lg py-6"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "처리중..." : "회원가입"}
      </Button>
    </form>
  );
}
