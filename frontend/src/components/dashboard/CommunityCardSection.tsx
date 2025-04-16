"use client";

import { useCommunityDashboard } from "@/query/queries/community";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";

type CardSectionProps = {
  projectId: string;
  title: string;
};

export default function CommunityCardSection({
  projectId,
  title,
}: CardSectionProps) {
  const { data: communities } = useCommunityDashboard(projectId);
  const { notice, feed, vote } = communities ?? {};
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
        <button onClick={() => navigateTo(`/myproject/${projectId}/community`)}>
          <ChevronRight />
        </button>
      </div>
      <hr className="my-4" />

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {/* 공지사항 */}
        {notice && (
          <section className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1">
            <h3 className="text-sm font-bold text-indigo-500">📢 공지사항</h3>
            <p className="text-base font-semibold text-gray-800">
              {notice.title}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {notice.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(notice.createdAt)}
            </p>
          </section>
        )}

        {/* 피드 */}
        {feed && (
          <section className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1">
            <h3 className="text-sm font-bold text-green-600">📝 피드</h3>
            <p className="text-base font-semibold text-gray-800">
              {feed.title}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {feed.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(feed.createdAt)}
            </p>
          </section>
        )}

        {/* 투표 */}
        {vote && (
          <section className="max-h-[33%] overflow-y-auto rounded border bg-gray-50 p-4 flex flex-col gap-1">
            <h3 className="text-sm font-bold text-purple-600">🗳️ 투표</h3>
            <p className="text-base font-semibold text-gray-800">
              {vote.title}
            </p>
            <p className="text-sm text-gray-600">{vote.content}</p>
            <ul className="mt-2 list-none text-sm text-gray-700 space-y-1">
              {vote.options?.map((opt: any) => (
                <li key={opt.id}>
                  <p className="bg-green-100 p-1 rounded-md">{opt.content}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(vote.createdAt)}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
