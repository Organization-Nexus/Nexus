"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Newspaper, Siren, SquarePlus, Vote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommunityClientTapsProps } from "@/types/community";
import CreateCommunityModal from "../modal/community/CreateCommunityModal";
import CommunityTemplate from "./contents/CommunityTemplate";

const tabs = [
  { key: "notice", label: "공지사항", icon: <Siren size={20} /> },
  { key: "feed", label: "피드", icon: <Newspaper size={20} /> },
  { key: "vote", label: "투표", icon: <Vote size={20} /> },
];

export default function CommunityClientTabs({
  projectId,
  projectUser,
}: CommunityClientTapsProps) {
  const [selectedTab, setSelectedTab] = useState("notice");
  const [openCreateCommunityForm, setOpenCreateCommunityForm] = useState(false);
  const [communityFormType, setCommunityFormType] = useState<string | null>(
    null
  );

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
    <div>
      <div className="w-3/5 space-y-4">
        <hr className="my-4" />
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
              {tabs.map(({ key, label, icon }) => (
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
        {/* 커뮤니티 컨텐츠 */}
        <div className="mt-8 h-[850px] overflow-y-auto">
          <CommunityTemplate
            key={selectedTab}
            type={tabs.find((t) => t.key === selectedTab)?.key || ""}
            projectUser={projectUser}
            projectId={projectId}
          />
        </div>
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
