"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Calendar } from "@/components/ui/calendar";
import React from "react";

// 카드 데이터 추가
const fakeData = [
  {
    title: "Card 1",
    description: "This is the description for Card 1",
    content: "Content for Card 1",
    footer: "Footer 1",
  },
  {
    title: "Card 2",
    description: "This is the description for Card 2",
    content: "Content for Card 2",
    footer: "Footer 2",
  },
  {
    title: "Card 3",
    description: "This is the description for Card 3",
    content: "Content for Card 3",
    footer: "Footer 3",
  },
  {
    title: "Card 4",
    description: "This is the description for Card 4",
    content: "Content for Card 4",
    footer: "Footer 4",
  },
  {
    title: "Card 5",
    description: "This is the description for Card 5",
    content: "Content for Card 5",
    footer: "Footer 5",
  },
  {
    title: "Card 6",
    description: "This is the description for Card 6",
    content: "Content for Card 6",
    footer: "Footer 6",
  },
  {
    title: "Card 7",
    description: "This is the description for Card 7",
    content: "Content for Card 7",
    footer: "Footer 7",
  },
  {
    title: "Card 8",
    description: "This is the description for Card 8",
    content: "Content for Card 8",
    footer: "Footer 8",
  },
];

const chartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
];

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <>
      <Button variant="outline">Click me</Button>

      {/* Carousel for the cards */}
      <Carousel>
        <CarouselContent>
          <div className="flex space-x-4 overflow-hidden">
            {fakeData.map((card, index) => (
              <CarouselItem key={index}>
                <Card className="w-[300px]">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{card.content}</p>
                  </CardContent>
                  <CardFooter>
                    <p>{card.footer}</p>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </div>
        </CarouselContent>
        <CarouselPrevious>
          <Button variant="outline">Previous</Button>
        </CarouselPrevious>
        <CarouselNext>
          <Button variant="outline">Next</Button>
        </CarouselNext>
      </Carousel>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms2" />
        <label
          htmlFor="terms2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>

      {/* 차트를 포함하는 컨테이너 */}
      <div className="w-[50%]">
        <ChartContainer config={{}}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </>
  );
}
