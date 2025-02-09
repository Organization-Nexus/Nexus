"use client";

import { Suspense, useState } from "react";
import CommunityTemplate from "./contents/CommunityTemplate";
import { Button } from "../ui/button";
import { Newspaper, Siren, SquarePlus, Users, Vote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommunityClientTapsProps } from "@/types/community";
import { useFeedList, useNoticeList } from "@/query/queries/community";
import CreateCommunityModal from "../modal/community/CreateCommunityModal";

const tabs = [
  { key: "all", label: "전체보기", icon: <Users size={20} /> },
  { key: "notice", label: "공지사항", icon: <Siren size={20} /> },
  { key: "feed", label: "피드", icon: <Newspaper size={20} /> },
  { key: "vote", label: "투표", icon: <Vote size={20} /> },
];

export default function CommunityClientTabs({
  projectId,
  projectUser,
  feeds: initialFeeds,
  notices: initialNotices,
}: CommunityClientTapsProps) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [openCreateCommunityForm, setOpenCreateCommunityForm] = useState(false);
  const [communityFormType, setCommunityFormType] = useState<string | null>(
    null
  );

  const notices = useNoticeList(projectId, initialNotices).data;
  const feeds = useFeedList(projectId, initialFeeds).data;

  const contentData: Record<string, any> = { notice: notices, feed: feeds };

  const handleTabClick = (tabKey: string) => setSelectedTab(tabKey);

  const handleCreateModalOpen = (key: string) => {
    const tab = tabs.find((t) => t.key === key);
    setCommunityFormType(tab?.label || key);
    setOpenCreateCommunityForm(true);
  };

  const handleCreateModalClose = () => {
    setOpenCreateCommunityForm(false);
    setCommunityFormType(null);
  };

  return (
    <div className="flex justify-center w-full p-8">
      <div className="w-4/5 max-w-7xl space-y-4">
        <div className="flex justify-between items-center">
          {/* 커뮤니티 탭 */}
          <div className="flex items-center space-x-6">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`flex items-center space-x-2 py-2 text-gray-600 hover:text-primary transition-colors ${
                  selectedTab === key
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : ""
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
          {/* 커뮤니티 생성 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                <SquarePlus /> 커뮤니티 생성
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>컨텐츠 선택</DropdownMenuLabel>
              {tabs
                .filter(({ key }) => key !== "all")
                .map(({ key, label, icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleCreateModalOpen(key)}
                    disabled={key === "notice" && !projectUser.is_sub_admin}
                    className={
                      key === "notice" && !projectUser.is_sub_admin
                        ? "text-gray-500"
                        : ""
                    }
                  >
                    {icon} {label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <hr className="my-4" />

        {/* 커뮤니티 컨텐츠 */}
        <Suspense fallback={<div>로딩 중...</div>}>
          <div className="mt-8">
            {tabs.map(({ key, label }) =>
              selectedTab === key ? (
                key === "all" || key === "vote" ? (
                  <div key={key}>{label}</div>
                ) : (
                  <CommunityTemplate
                    key={key}
                    type={label}
                    items={contentData[key] || []}
                    projectUser={projectUser}
                    projectId={projectId}
                  />
                )
              ) : null
            )}
          </div>
        </Suspense>
      </div>

      {/* 커뮤니티 생성 모달 */}
      {openCreateCommunityForm && communityFormType && (
        <CreateCommunityModal
          isOpen={openCreateCommunityForm}
          onClose={handleCreateModalClose}
          type={communityFormType}
          projectId={projectId}
        />
      )}
    </div>
  );
}
