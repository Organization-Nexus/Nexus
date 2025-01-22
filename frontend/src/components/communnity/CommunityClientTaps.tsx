"use client";

import { useState } from "react";
import { Users, Siren, Newspaper, Vote } from "lucide-react";
import FeedContent from "./contents/FeedContent";
import { CommunityClientTapsProps } from "@/types/community";

const tabButtonStyle =
  "flex items-center space-x-2 py-2 text-gray-600 hover:text-primary transition-colors";
const activeTabStyle = "text-primary font-semibold border-b-2 border-primary";
const tabContentStyle = "";

export default function CommunityClientTabs({
  feeds,
  notices,
}: CommunityClientTapsProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex justify-center w-full p-8">
      <div className="w-4/5 max-w-7xl space-y-4">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabClick("all")}
            className={`${tabButtonStyle} ${
              selectedTab === "all" ? activeTabStyle : ""
            }`}
          >
            <Users size={20} />
            <span>전체보기</span>
          </button>

          <button
            onClick={() => handleTabClick("notices")}
            className={`${tabButtonStyle} ${
              selectedTab === "notices" ? activeTabStyle : ""
            }`}
          >
            <Siren size={20} />
            <span>공지사항</span>
          </button>

          <button
            onClick={() => handleTabClick("feeds")}
            className={`${tabButtonStyle} ${
              selectedTab === "feeds" ? activeTabStyle : ""
            }`}
          >
            <Newspaper size={20} />
            <span>피드</span>
          </button>

          <button
            onClick={() => handleTabClick("votes")}
            className={`${tabButtonStyle} ${
              selectedTab === "votes" ? activeTabStyle : ""
            }`}
          >
            <Vote size={20} />
            <span>투표</span>
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="mt-8">
          {selectedTab === "all" && (
            <div className={tabContentStyle}>전체보기 콘텐츠</div>
          )}
          {selectedTab === "notices" && (
            <div className={tabContentStyle}>공지사항 콘텐츠</div>
          )}
          {selectedTab === "feeds" && (
            <div className={tabContentStyle}>
              <FeedContent feeds={feeds} />
            </div>
          )}
          {selectedTab === "votes" && (
            <div className={tabContentStyle}>투표 콘텐츠</div>
          )}
        </div>
      </div>
    </div>
  );
}
