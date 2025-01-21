import { ProjectProps } from "@/types/project";
import React from "react";

export default function communityInfo(project: ProjectProps) {
  return <div>{project?.title}</div>;
}
