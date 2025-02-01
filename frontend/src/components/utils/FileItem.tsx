import { FileText } from "lucide-react";
import { FileItemProps } from "@/types/utill";
import { isImageFile } from "./isImageFile";

export default function FileItem({ file }: FileItemProps) {
  const fullFileName =
    typeof file === "string" ? file.split("/").pop() || "download" : file.name;
  const fileName = fullFileName.replace(/^\d+-/, "");
  const decodedFileName = decodeURIComponent(fileName);

  return isImageFile(file) ? (
    <img
      src={typeof file === "string" ? file : URL.createObjectURL(file)}
      alt="Attached file"
      className="rounded-md"
    />
  ) : (
    <div className="flex items-center justify-between border bg-gray-100 p-4 rounded-md">
      <div className="flex items-center space-x-2">
        <FileText className="text-blue-500" />
        <a
          href={typeof file === "string" ? file : URL.createObjectURL(file)}
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
