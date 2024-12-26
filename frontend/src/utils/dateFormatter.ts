// utils 폴더는 유틸리티 함수를 관리
// 데이터 포맷팅, 날짜 처리, 숫자 계산 등
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
