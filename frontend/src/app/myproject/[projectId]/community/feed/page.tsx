import { ProjectIdProps } from "@/types/project";
import React from "react";

export default function page({ params }: ProjectIdProps) {
  console.log("✅ PARAMS: ", params);
  return <div>page</div>;
}
