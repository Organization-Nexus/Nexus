// components/RegisterFormComponent.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnderlineInput } from "@/components/ui/underlineInput";
import { PositionSelect } from "@/components/User/PositionSelect";
import { useState } from "react";
import { authApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { RegisterRequest } from "@/types/auth";
import { userValidation } from "@/utils/validators/userValidation";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  githubUrl?: string;
  mainPosition?: string;
}

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    const validationError =
      userValidation[name as keyof typeof userValidation]?.(value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData: RegisterRequest = {
        ...formData,
        mainPosition: selectedPositions,
      };

      const response = await authApi.register(signupData);
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <UnderlineInput
          placeholder="이름"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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
          required
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
          required
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
          required
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
        <PositionSelect onSelectPosition={setSelectedPositions} />
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
