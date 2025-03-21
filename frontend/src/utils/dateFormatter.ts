export const formatDate = (date: string | Date): string => {
  const koreanTime = new Date(date);
  const year = koreanTime.getFullYear();
  const month = (koreanTime.getMonth() + 1).toString().padStart(2, "0");
  const day = koreanTime.getDate().toString().padStart(2, "0");
  const hours = koreanTime.getHours().toString().padStart(2, "0");
  const minutes = koreanTime.getMinutes().toString().padStart(2, "0");
  const seconds = koreanTime.getSeconds().toString().padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
