"use client";

import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginFormComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await authApi.login(formData);

      // 토큰 저장
      Cookies.set("access_token", data.access_token);
      Cookies.set("refresh_token", data.refresh_token);

      router.push("/myproject");
      alert("로그인되었습니다.");
    } catch (error: any) {
      setError(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
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
          <a
            href="/find-password"
            className="text-gray-500 hover:text-gray-700"
          >
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
