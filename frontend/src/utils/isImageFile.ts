export function isImageFile(file: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = file.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
}
