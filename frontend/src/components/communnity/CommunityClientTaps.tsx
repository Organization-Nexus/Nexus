"use client";

import { useState } from "react";
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
import CommunityForm from "../modal/CommunityForm";

const tabButtonStyle =
  "flex items-center space-x-2 py-2 text-gray-600 hover:text-primary transition-colors";
const activeTabStyle = "text-primary font-semibold border-b-2 border-primary";

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
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [isCommunityFormOpen, setisCommunityFormOpen] = useState(false);
  const [createType, setCreateType] = useState<string | null>(null);

  const { data: notices } = useNoticeList(projectId, initialNotices);
  const { data: feeds } = useFeedList(projectId, initialFeeds);

  const handleTabClick = (tabKey: string) => {
    setSelectedTab(tabKey);
  };

  const openCommunityForm = (key: string) => {
    setCreateType(key);
    setisCommunityFormOpen(true);
  };

  const closeCommunityForm = () => {
    setisCommunityFormOpen(false);
    setCreateType(null);
  };

  return (
    <div className="flex justify-center w-full p-8">
      <div className="w-4/5 max-w-7xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`${tabButtonStyle} ${
                  selectedTab === tab.key ? activeTabStyle : ""
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                <SquarePlus />
                커뮤니티 생성
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>컨텐츠 선택</DropdownMenuLabel>
              {tabs
                .filter((tab) => tab.key !== "all")
                .map((tab) => (
                  <DropdownMenuItem
                    key={tab.key}
                    onClick={() => openCommunityForm(tab.label)}
                    disabled={
                      tab.label === "공지사항" && !projectUser.is_sub_admin
                    }
                    className={
                      tab.label === "공지사항" && !projectUser.is_sub_admin
                        ? "text-gray-500"
                        : ""
                    }
                  >
                    {tab.icon}
                    {tab.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <hr className="my-4" />

        <div className="mt-8">
          {selectedTab === "all" && <div>전체보기</div>}
          {selectedTab === "notice" && (
            <CommunityTemplate
              isOpen={isCommunityFormOpen}
              onClose={closeCommunityForm}
              type="공지사항"
              items={notices}
              projectUser={projectUser}
              projectId={projectId}
              onEdit={openCommunityForm}
            />
          )}
          {selectedTab === "feed" && (
            <CommunityTemplate
              isOpen={isCommunityFormOpen}
              onClose={closeCommunityForm}
              type="피드"
              items={feeds}
              projectUser={projectUser}
              projectId={projectId}
              onEdit={openCommunityForm}
            />
          )}
          {selectedTab === "vote" && <div>투표 콘텐츠</div>}
        </div>
      </div>

      {isCommunityFormOpen && createType && (
        <CommunityForm
          isOpen={isCommunityFormOpen}
          onClose={closeCommunityForm}
          type={createType}
          projectId={projectId}
          mode="create"
        />
      )}
    </div>
  );
}
