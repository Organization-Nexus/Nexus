import { FileText } from "lucide-react";
import { isImageFile } from "@/utils/isImageFile";
import { FileItemProps } from "@/types/utill";

export default function FileItem({ file }: FileItemProps) {
  console.log("🪼 file : ", file);
  const fullFileName = file.name.split("/").pop() || "download";
  const fileName = fullFileName.replace(/^\d+-/, "");
  const decodedFileName = decodeURIComponent(fileName);

  return isImageFile(file.name) ? (
    <img
      src={URL.createObjectURL(file)}
      alt="Attached file"
      className="rounded-md"
    />
  ) : (
    <div className="flex items-center justify-between border bg-gray-100 p-4 rounded-md">
      <div className="flex items-center space-x-2">
        <FileText className="text-blue-500" />
        <a
          href={URL.createObjectURL(file)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate max-w-xs"
        >
          {decodedFileName}
        </a>
      </div>
    </div>
  );
}
