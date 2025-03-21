const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  total: 20 * 1024 * 1024, // 전체 20MB
};
export const validateFile = (file: File, files: FileList | null): string => {
  const fileType = file.type.startsWith("image/") ? "image" : "document";
  let errorMessage = "";
  if (file.size > FILE_SIZE_LIMITS[fileType]) {
    if (fileType === "image") {
      errorMessage = "이미지는 최대 5MB까지 업로드 가능합니다.";
    } else if (fileType === "document") {
      errorMessage = "문서는 최대 10MB까지 업로드 가능합니다.";
    }
  } else {
    const totalSize = files
      ? Array.from(files).reduce((sum, file) => sum + file.size, 0)
      : 0;
    if (totalSize && totalSize > FILE_SIZE_LIMITS.total) {
      errorMessage = "전체 파일 크기는 최대 20MB까지 업로드 가능합니다.";
    }
  }

  return errorMessage;
};
