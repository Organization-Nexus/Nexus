import { formatDate } from "./dateFormatter";
export const convertToKST = (utcTime: string): string => {
  const utcDate = new Date(utcTime);
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(utcDate.getTime() + kstOffset);

  return formatDate(kstDate);
};
