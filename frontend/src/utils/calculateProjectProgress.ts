const calculateProjectProgress = (start_date: string, end_date: string) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const today = new Date();

  if (today < startDate) return 0;
  if (today > endDate) return 100;

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = today.getTime() - startDate.getTime();

  return Math.round((elapsedDuration / totalDuration) * 100);
};

export default calculateProjectProgress;
