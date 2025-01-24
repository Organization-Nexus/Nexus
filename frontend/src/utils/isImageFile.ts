export function isImageFile(file: string | undefined): boolean {
  // file이 유효하지 않으면 false 반환
  if (typeof file !== "string" || !file) return false;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = file.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
}
