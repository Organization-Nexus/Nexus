import { formatDate } from "./dateFormatter";
export const convertToKST = (date: string): string => {
  const utcDate = new Date(date);
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(utcDate.getTime() + kstOffset);

  return kstDate.toISOString().replace("T", " ").substring(0, 19);
};
