"use client";

import { Project } from "@/types/project";

export default function ProjectDetailCard({ project }: { project: Project }) {
  return (
    <>
      <div>{project.title}</div>
    </>
  );
}
