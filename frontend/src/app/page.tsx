"use client";

import { useEffect, useState } from "react";
import { getPing } from "../api/utils/ping";

export default function Home() {
  const [ping, setPing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const data = await getPing();
        setPing(data);
      } catch (error) {
        console.error("Failed to fetch ping:", error);
        setPing("Error fetching ping");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPing();
  }, []);

  return <div>{isLoading ? <p>Loading...</p> : <p>{ping}</p>}</div>;
}
