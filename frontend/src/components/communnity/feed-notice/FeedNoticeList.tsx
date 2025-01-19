import React from "react";
import { FeedNoticeListProps } from "@/types/feed";
import { convertToKST } from "@/utils/convertToKst";

// 파일 타입에 맞게 파일을 처리하는 함수
const isImageFile = (file: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  return imageExtensions.some((ext) => file.toLowerCase().endsWith(ext));
};

function FeedNoticeList({ feeds }: FeedNoticeListProps) {
  return (
    <div className="space-y-6">
      {feeds.map((feed) => {
        // createdAt을 한국 시간으로 변환하고 포맷
        const createdAtKST = convertToKST(feed.createdAt);

        return (
          <div
            key={feed.id}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
          >
            {/* Author Information */}
            {feed.author && (
              <div className="flex justify-between items-center mb-4">
                {/* Left: Profile Image, Name, Position */}
                <div className="flex items-center space-x-3">
                  <img
                    src={feed.author.user.log.profileImage}
                    alt={feed.author.user.name}
                    className="w-16 h-16 rounded-md"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {feed.author.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {feed.author.position}
                    </p>
                  </div>
                </div>
                {/* Right: Created At */}
                <p className="text-xs text-gray-500">{createdAtKST}</p>
              </div>
            )}

            {/* Feed Title */}
            <hr className="border-gray-300 my-4" />
            <h2 className="text-2xl font-bold text-gray-900">{feed.title}</h2>
            <hr className="border-gray-300 my-4" />

            {/* Feed Content */}
            <p className="text-lg text-gray-700 my-4">{feed.content}</p>

            {/* Attached Files */}
            {feed.feed_files && feed.feed_files.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {feed.feed_files.map((file: string, index: number) => (
                    <div key={index}>
                      {isImageFile(file) ? (
                        <img
                          src={file}
                          alt={`File ${index}`}
                          className="w-36 h-36 object-cover rounded-md"
                        />
                      ) : (
                        <div className="border p-4 rounded-md my-2">
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {file.split("/").pop()}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FeedNoticeList;
