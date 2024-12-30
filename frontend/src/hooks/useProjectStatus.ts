import { useMemo } from "react";

const useProjectStatus = (start_date: string, end_date: string) => {
  const getStatus = useMemo(() => {
    const now = new Date();
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (now < start) return "in-progress";
    if (now >= end) return "completed";
    return "in-progress";
  }, [start_date, end_date]);

  return getStatus;
};

export default useProjectStatus;
