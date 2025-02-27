"use client";

import { useState } from "react";
import MilestoneFilter from "./MilestoneFilter";

import CreateMilestoneButton from "./CreateMilestoneButton";
import MilestoneList from "./MilestoneList";

interface MilestoneContainerProps {
  projectId: number;
}

export default function MilestoneContainer({
  projectId,
}: MilestoneContainerProps) {
  const [filter, setFilter] = useState<"All" | "FE" | "BE">("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-3/5 space-y-4">
      <hr />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <MilestoneFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>
        <CreateMilestoneButton projectId={projectId} />
      </div>
      <div>
        <MilestoneList
          projectId={projectId}
          filter={filter}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
