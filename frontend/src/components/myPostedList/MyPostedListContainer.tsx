"use client";

import { useState } from "react";
import PostedFeed from "./community/Feed";
import PostedNotice from "./community/Notice";
import PostedVote from "./community/Vote";
import Milestone from "./projectWorkflow/Milestone";
import Issue from "./projectWorkflow/Issue";
import Minutes from "./minutes/Minutes";
import { FileText, List, Flag, Newspaper, Siren, Vote } from "lucide-react";

const tabs = [
  {
    key: "communityHub",
    label: "커뮤니티",
    subTabs: [
      {
        key: "notice",
        label: "공지사항",
        component: PostedNotice,
        icon: <Siren size={18} />,
      },
      {
        key: "feed",
        label: "피드",
        component: PostedFeed,
        icon: <Newspaper size={18} />,
      },
      {
        key: "vote",
        label: "투표",
        component: PostedVote,
        icon: <Vote size={18} />,
      },
    ],
  },
  {
    key: "projectWorkflow",
    label: "프로젝트 업무",
    subTabs: [
      {
        key: "milestone",
        label: "마일스톤",
        component: Milestone,
        icon: <Flag size={18} />,
      },
      {
        key: "issue",
        label: "이슈",
        component: Issue,
        icon: <List size={18} />,
      },
    ],
  },
  {
    key: "minutes",
    label: "회의록",
    subTabs: [
      {
        key: "minutes",
        label: "회의록",
        component: Minutes,
        icon: <FileText size={18} />,
      },
    ],
  },
];

export default function MyPostedListContainer() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [activeSubTab, setActiveSubTab] = useState(tabs[0].subTabs[0].key);

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-[78vh] overflow-hidden">
      {/* 상위 탭 메뉴 */}
      <div className="flex justify-around border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`py-2 px-6 text-lg font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-green-100 text-green-500"
                : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            } rounded-lg`}
            onClick={() => {
              setActiveTab(tab.key);
              setActiveSubTab(tab.subTabs[0].key);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 하위 탭 메뉴 */}
      <div className="mt-4 border-b pb-2 flex space-x-6 overflow-x-auto">
        {currentTab?.subTabs.map((subTab) => (
          <button
            key={subTab.key}
            className={`py-2 px-4 flex items-center gap-2 text-sm font-medium transition-all ${
              activeSubTab === subTab.key
                ? "bg-green-100 text-green-500"
                : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            } rounded-lg`}
            onClick={() => setActiveSubTab(subTab.key)}
          >
            {subTab.icon}
            {subTab.label}
          </button>
        ))}
      </div>

      {/* 선택된 하위 탭의 콘텐츠 */}
      <div className="mt-6 h-[60vh] overflow-auto">
        {currentTab?.subTabs
          .find((subTab) => subTab.key === activeSubTab)
          ?.component()}
      </div>
    </div>
  );
}
