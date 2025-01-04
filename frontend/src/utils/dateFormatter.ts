export function formatDate(date: string) {
  const koreanTime = new Date(date);
  const year = koreanTime.getFullYear();
  const month = (koreanTime.getMonth() + 1).toString().padStart(2, "0");
  const day = koreanTime.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}
