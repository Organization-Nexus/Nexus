import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function TimeAgo({ date }: { date: Date }) {
  const [relativeTime, setRelativeTime] = useState<string>("");

  useEffect(() => {
    setRelativeTime(formatDistanceToNow(date, { addSuffix: true }));
  }, [date]);

  return <span>{relativeTime}</span>;
}
