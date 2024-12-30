"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function ForgotPasswordForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          className="text-lg p-6"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-custom-point hover:bg-custom-hover text-lg py-6"
      >
        전송하기
      </Button>
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
