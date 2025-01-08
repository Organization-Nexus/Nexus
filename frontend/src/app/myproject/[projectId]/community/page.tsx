import { ProjectIdProps } from "@/types/project";
import React from "react";

export default async function page({ params }: ProjectIdProps) {
  console.log("✅ PARAMS: ", params);
  return <div>page</div>;
}
