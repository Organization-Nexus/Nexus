export const isImageFile = (file: string | File) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];

  const fileName = typeof file === "string" ? file : file.name;

  const extension = fileName.split(".").pop()?.toLowerCase();

  return imageExtensions.includes(extension || "");
};
