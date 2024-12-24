"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnderlineInput } from "@/components/ui/underlineInput";
import { PositionSelect } from "@/components/User/PositionSelect";
import { useState } from "react";
import { RegisterForm } from "@/types/auth";
import { userAPI } from "@/api/utils/user";
import { useRouter } from "next/navigation";

export default function RegisterFormComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<RegisterForm, "mainPosition">>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    githubUrl: "",
  });
  const [selectedPositions, setSelectedPositions] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const signupData: RegisterForm = {
        ...formData,
        mainPosition: selectedPositions,
      };

      const response = await userAPI.register(signupData);
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다."
      );
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
      </div>
      <div>
        <UnderlineInput
          placeholder="전화번호"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <UnderlineInput
          placeholder="github 주소 (선택)"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
        />
      </div>

      <div>
        <p className="mb-3 px-3 text-muted-foreground text-base md:text-sm">
          주포지션 선택
        </p>
        <PositionSelect onSelectPosition={setSelectedPositions} />
      </div>

      <Button
        className="w-full bg-custom-point hover:bg-custom-hover text-white text-lg py-6"
        type="submit"
      >
        회원가입
      </Button>
    </form>
  );
}
