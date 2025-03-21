import ForgotPasswordForm from "@/components/authh/ForgotPasswordForm";
import Image from "next/image";

export default function ForgotPasswordPage() {
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
              <h2 className="mb-6 text-3xl text-center font-semibold">
                {" "}
                비밀번호 재설정
              </h2>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                가입했던 이메일을 입력하시면 비밀번호 재설정 인증 코드를
                보내드립니다.
              </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
