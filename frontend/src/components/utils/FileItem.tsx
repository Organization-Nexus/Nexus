import React from "react";
import { FileText } from "lucide-react";
import { isImageFile } from "@/utils/isImageFile";

interface FileItemProps {
  file: string;
}

function FileItem({ file }: FileItemProps) {
  const fullFileName = file.split("/").pop() || "download";
  const fileName = fullFileName.replace(/^\d+-/, "");
  const decodedFileName = decodeURIComponent(fileName);

  return isImageFile(file) ? (
    <img src={file} alt="Attached file" className="rounded-md" />
  ) : (
    <div className="flex items-center justify-between border bg-gray-100 p-4 rounded-md">
      <div className="flex items-center space-x-2">
        <FileText className="text-blue-500" />
        <a
          href={file}
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

export default FileItem;
