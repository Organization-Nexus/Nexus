// app/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-white min-h-screen flex items-center">
      <div className="w-full h-screen grid grid-cols-10">
        {/* 왼쪽 섹션 - 로고 */}
        <div className="col-span-4 bg-gradient-to-b from-[#ABC4FF]/20 from-40% to-[#50E161]/20 flex items-center justify-center h-full">
          <div>
            <Image
              src="/images/Nexus_logo_removed.png"
              alt="Nexus Logo"
              width={300}
              height={300}
              priority
            />
          </div>
        </div>

        {/* 오른쪽 섹션 - 로그인 폼 */}
        <div className="col-span-6 p-8 flex justify-center items-center">
          <div className="w-[500px] bg-white p-8 -mt-32">
            <div className="mb-6">
              <h2 className="text-3xl text-center font-semibold">로그인</h2>
            </div>
            <div>
              <form>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      placeholder="이메일"
                      className="text-lg p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호"
                      className="text-lg p-6"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
