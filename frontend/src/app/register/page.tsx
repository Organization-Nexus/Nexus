import Image from "next/image";
import RegisterFormComponent from "@/components/Auth/RegisterForm";

export default function RegisterPage() {
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

        {/* 오른쪽 섹션 */}
        <div className="col-span-6 p-8 flex justify-center items-center">
          <div className="w-[500px] bg-white p-8 -mt-32">
            <div className="mb-6">
              <h2 className="text-3xl text-center font-semibold">회원가입</h2>
            </div>

            <RegisterFormComponent />
            <div className="text-sm text-right mt-4">
              <a href="/login" className="text-gray-500 hover:text-gray-700">
                이미 계정이 있으신가요?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
