// app/socket-test/page.tsx
import SimpleSocketTest from "@/components/utils/SimpleSocketTest";

export default function SocketTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">웹소켓 테스트 페이지</h1>

      <SimpleSocketTest />
    </div>
  );
}
