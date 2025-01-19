import React from "react";
import { FeedNoticeListProps } from "@/types/feed";

function FeedNoticeList({ feeds }: FeedNoticeListProps) {
  return (
    <div>
      {feeds.map((feed) => (
        <div
          key={feed.id}
          className="mb-6 p-6 border rounded-lg shadow-md bg-white"
        >
          {/* Feed Title and Content */}
          <h2 className="text-xl font-semibold text-gray-800">{feed.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{feed.content}</p>

          {/* Author Information */}
          {feed.author && (
            <p className="text-xs text-gray-500 mt-3">
              Author:{" "}
              <span className="font-medium">{feed.author.user.name}</span>
            </p>
          )}

          {/* Attached Files */}
          {feed.feed_files && feed.feed_files.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-gray-800">Attached Files:</p>
              <ul className="list-disc pl-5">
                {feed.feed_files.map((file: string, index: number) => (
                  <li key={index} className="text-blue-600 hover:underline">
                    <a href={file} target="_blank" rel="noopener noreferrer">
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Created At */}
          <p className="text-xs text-gray-500 mt-4">
            Created at: {new Date(feed.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default FeedNoticeList;
