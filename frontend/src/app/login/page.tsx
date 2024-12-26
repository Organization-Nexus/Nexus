import LoginFormComponent from "@/components/Auth/LoginForm";
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
            <LoginFormComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
