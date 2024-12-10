"use client";

import React from "react";
import { PiUserBold } from "react-icons/pi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <CarouselContent>
        {projects.map((project, index) => (
          <CarouselItem key={index} className="basis-4/10">
            <div className="p-1">
              <Card className="w-[320px] h-[180px]">
                <CardHeader className="flex gap-4">
                  <div className="w-16 h-16 border-2 border-gray-500 rounded-md"></div>
                  <div className="ml-2">
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex items-center text-gray-400 text-sm gap-1 mt-2">
                      <PiUserBold />
                      <p>{project.members.length}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>

                <CardFooter>
                  <div className="flex text-gray-400 gap-6 text-sm">
                    <p>시작일 : {project.start_date}</p>
                    <p>마감일 : {project.end_date}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious>
        <button className="text-white bg-black p-2 rounded">Previous</button>
      </CarouselPrevious>
      <CarouselNext>
        <button className="text-white bg-black p-2 rounded">Next</button>
      </CarouselNext>
    </Carousel>
  );
};

export default ProjectList;
