// common 폴더는 공통 UI 요소 (버튼, 헤더 등)

export default function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>;
}
