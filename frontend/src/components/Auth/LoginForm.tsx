// components/Auth/LoginForm.tsx
"use client";

import { userAPI } from "@/api/utils/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginFormComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await userAPI.login(formData);
      router.push("/myproject");
      alert("로그인되었습니다.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Input
            id="email"
            placeholder="이메일"
            className="text-lg p-6"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            placeholder="비밀번호"
            className="text-lg p-6"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="text-sm text-right">
          <a
            href="/register"
            className="text-gray-500 hover:text-gray-700 pr-2"
          >
            회원가입
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            비밀번호 찾기
          </a>
        </div>
        <Button className="w-full bg-custom-point hover:bg-custom-hover text-lg py-6">
          로그인
        </Button>
      </div>
    </form>
  );
}
